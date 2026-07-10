resource "aws_ecs_cluster" "main" {
  name = "despachos-cluster"
}


resource "aws_security_group" "ecs_frontend_sg" {
  name        = "despachos-ecs-frontend-sg"
  description = "Security group for ECS frontend task"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_backend_sg" {
  name        = "despachos-ecs-backend-sg"
  description = "Security group for ECS backend tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 8081
    to_port         = 8081
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_frontend_sg.id, aws_security_group.internal_alb_sg.id]
  }

  ingress {
    from_port       = 8082
    to_port         = 8082
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_frontend_sg.id, aws_security_group.internal_alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_cloudwatch_log_group" "frontend_logs" {
  name              = "/ecs/despachos-frontend"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "ms_ventas_logs" {
  name              = "/ecs/despachos-ms-ventas"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "ms_despacho_logs" {
  name              = "/ecs/despachos-ms-despacho"
  retention_in_days = 7
}

# --- Frontend Task ---
resource "aws_ecs_task_definition" "frontend" {
  family                   = "despachos-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = data.aws_iam_role.lab_role.arn
  task_role_arn            = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([{
    name      = "frontend"
    image     = "${aws_ecr_repository.frontend.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 80
      hostPort      = 80
    }]
    environment = [
      { name = "VENTAS_URL", value = "http://${aws_lb.internal.dns_name}" },
      { name = "DESPACHO_URL", value = "http://${aws_lb.internal.dns_name}" }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.frontend_logs.name
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_ecs_service" "frontend" {
  name            = "despachos-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
    security_groups  = [aws_security_group.ecs_frontend_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend_tg.arn
    container_name   = "frontend"
    container_port   = 80
  }
}

# --- Backend ms-ventas Task ---
resource "aws_ecs_task_definition" "ms_ventas" {
  family                   = "despachos-ms-ventas"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = data.aws_iam_role.lab_role.arn
  task_role_arn            = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([{
    name      = "ms-ventas"
    image     = "${aws_ecr_repository.ms_ventas.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 8082
      hostPort      = 8082
    }]
    environment = [
      { name = "DB_ENDPOINT", value = aws_db_instance.mysql.address },
      { name = "DB_PORT", value = "3306" },
      { name = "DB_NAME", value = "bd_ventas" }
    ]
    secrets = [
      { name = "DB_USERNAME", valueFrom = "${aws_secretsmanager_secret.db_credentials.arn}:username::" },
      { name = "DB_PASSWORD", valueFrom = "${aws_secretsmanager_secret.db_credentials.arn}:password::" }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ms_ventas_logs.name
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_ecs_service" "ms_ventas" {
  name            = "despachos-ms-ventas-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.ms_ventas.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_groups  = [aws_security_group.ecs_backend_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ms_ventas_tg.arn
    container_name   = "ms-ventas"
    container_port   = 8082
  }

}

# --- Backend ms-despacho Task ---
resource "aws_ecs_task_definition" "ms_despacho" {
  family                   = "despachos-ms-despacho"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 512
  memory                   = 1024
  execution_role_arn       = data.aws_iam_role.lab_role.arn
  task_role_arn            = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([{
    name      = "ms-despacho"
    image     = "${aws_ecr_repository.ms_despacho.repository_url}:latest"
    essential = true
    portMappings = [{
      containerPort = 8081
      hostPort      = 8081
    }]
    environment = [
      { name = "DB_ENDPOINT", value = aws_db_instance.mysql.address },
      { name = "DB_PORT", value = "3306" },
      { name = "DB_NAME", value = "bd_despachos" }
    ]
    secrets = [
      { name = "DB_USERNAME", valueFrom = "${aws_secretsmanager_secret.db_credentials.arn}:username::" },
      { name = "DB_PASSWORD", valueFrom = "${aws_secretsmanager_secret.db_credentials.arn}:password::" }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.ms_despacho_logs.name
        "awslogs-region"        = "us-east-1"
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_ecs_service" "ms_despacho" {
  name            = "despachos-ms-despacho-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.ms_despacho.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private_1.id, aws_subnet.private_2.id]
    security_groups  = [aws_security_group.ecs_backend_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ms_despacho_tg.arn
    container_name   = "ms-despacho"
    container_port   = 8081
  }

}

