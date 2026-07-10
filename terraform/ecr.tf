resource "aws_ecr_repository" "frontend" {
  name                 = "despachos-frontend"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "ms_ventas" {
  name                 = "despachos-ms-ventas"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "ms_despacho" {
  name                 = "despachos-ms-despacho"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}
