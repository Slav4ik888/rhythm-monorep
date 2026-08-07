export interface EmailConfig {
  user : string
  pass : string
}

interface Locals {
  greetting?        : string,
  name?             : string,
  url_site?         : string,
  url_confirmation? : string,
  url_link?         : string,
  email?            : string,
  userId?           : string,
  companyId?        : string,
  companyName?      : string,
  code?             : string,
  platform_name?    : string,
  password?         : string,
  partnerId?        : string,
}

interface Attachment {
  filename : string // filename to be reported as the name of the attached file. Use of unicode is allowed.
  path     : string // path to the file if you want to stream the file instead of including it (better for larger attachments)
}


export interface SendEmailOptions {
  template     : string,
  locals       : Locals,
  to           : string,
  subject      : string,
  attachments? : Attachment[]
}
