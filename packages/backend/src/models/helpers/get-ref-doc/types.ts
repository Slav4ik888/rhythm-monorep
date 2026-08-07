
// TODO: начал делать но не получилось...

export interface RefDataDocUsersType {
  companyId : string
  userId    : string
}

export interface RefDataDocCompanyType {
  companyId : string
}

export interface RefDataDocTasksType {
  userId : string
  taskId : string
}

export interface RefDataDocCommentsType {
  taskOwnerId : string
  commentId   : string
}

export interface RefDataDocGradeType {
  email     : string
  chapterId : string
}

export interface RefDataDocSertificateType {
  sertificateId: string
}


export type RefDataDocType = RefDataDocUsersType |
  RefDataDocCompanyType |
  RefDataDocTasksType |
  RefDataDocCommentsType |
  RefDataDocGradeType |
  RefDataDocSertificateType
  
