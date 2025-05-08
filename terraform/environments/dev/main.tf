module "guardduty" {
  source = "../../modules/guardduty"
}

module "security_hub" {
  source = "../../modules/security_hub"
}

module "macie" {
  source = "../../modules/macie"
}

module "inspector" {
  source = "../../modules/inspector"
}