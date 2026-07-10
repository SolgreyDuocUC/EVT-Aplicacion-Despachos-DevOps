resource "aws_security_group" "internal_alb_sg" {
  name        = "despachos-internal-alb-sg"
  description = "Security group for internal ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_frontend_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "internal" {
  name               = "despachos-internal-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.internal_alb_sg.id]
  subnets            = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name = "despachos-internal-alb"
  }
}

resource "aws_lb_target_group" "ms_ventas_tg" {
  name        = "despachos-ms-ventas-tg"
  port        = 8082
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/api/v1/ventas"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 10
    matcher             = "200-499"
  }
}

resource "aws_lb_target_group" "ms_despacho_tg" {
  name        = "despachos-ms-despacho-tg"
  port        = 8081
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/api/v1/despachos"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 5
    interval            = 10
    matcher             = "200-499"
  }
}

resource "aws_lb_listener" "internal_listener" {
  load_balancer_arn = aws_lb.internal.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Not found"
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener_rule" "ventas_rule" {
  listener_arn = aws_lb_listener.internal_listener.arn
  priority     = 10

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ms_ventas_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/ventas*"]
    }
  }
}

resource "aws_lb_listener_rule" "despacho_rule" {
  listener_arn = aws_lb_listener.internal_listener.arn
  priority     = 20

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ms_despacho_tg.arn
  }

  condition {
    path_pattern {
      values = ["/api/v1/despachos*"]
    }
  }
}
