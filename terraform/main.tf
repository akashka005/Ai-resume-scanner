provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "resume_scanner_sg" {
  name        = "resume-scanner-sg"
  description = "Allow inbound traffic for Resume Scanner"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Change to your IP for security
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "resume_scanner_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu 22.04 LTS
  instance_type = "t2.medium"
  key_name      = "your-key-pair-name"

  vpc_security_group_ids = [aws_security_group.resume_scanner_sg.id]

  tags = {
    Name = "ResumeScanner-Server"
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io docker-compose
              sudo systemctl start docker
              sudo usermod -aG docker ubuntu
              EOF
}

output "public_ip" {
  value = aws_instance.resume_scanner_server.public_ip
}
