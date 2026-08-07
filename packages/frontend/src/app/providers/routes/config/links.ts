export interface LinkType {
  name         : string
  href?        : string // href | route
  route?       : string
  requireAuth? : boolean // if true, the link will be hidden if the user is not authenticated
}
