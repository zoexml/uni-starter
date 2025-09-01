/* eslint-disable */
// @ts-ignore

export type AuthChangeOrgBody = {
  OrgId: string;
};

export type AuthChangeOrgResponse = {
  Id: string;
  Name: string;
  UserName: string;
  TenantId: string;
  Token: string;
  Expires: string;
  UserType: string;
  OrgId: string;
  OrgName: string;
  IsOrgUser: string;
  Code: string;
  Message: string;
};

export type AuthChangeOrgResponses = {
  200: AuthChangeOrgResponse;
};

export type AuthChangePhoneBody = {
  OldPhone: string;
  Phone: string;
  VerifyCode: string;
};

export type AuthChangePhoneResponse = boolean;

export type AuthChangePhoneResponses = {
  200: AuthChangePhoneResponse;
};

export type AuthGetOpenIdBody = string;

export type AuthGetOpenIdResponse = string;

export type AuthGetOpenIdResponses = {
  200: AuthGetOpenIdResponse;
};

export type AuthLoginBody = {
  /** 手机号 */
  Phone: string;
  /** 密码 */
  Password?: string;
  /** 'ValidateCode' | 'Password' */
  LoginType: string;
  /** 验证码 */
  VerifyCode?: string;
};

export type AuthLoginResponse = {
  Id: string;
  Name: string;
  UserName: string;
  TenantId: string;
  Token: string;
  Expires: string;
  UserType: string;
  Openid: string;
  OrgId: string;
  OrgName: string;
  IsOrgUser: string;
  ShopId: string;
  ShopName: string;
  Avatar: string;
  Code: string;
  Message: string;
};

export type AuthLoginResponses = {
  200: AuthLoginResponse;
};

export type AuthLogoutResponse = Record<string, unknown>;

export type AuthLogoutResponses = {
  200: AuthLogoutResponse;
};

export type AuthRefreshTokenResponse = Record<string, unknown>;

export type AuthRefreshTokenResponses = {
  200: AuthRefreshTokenResponse;
};

export type ConfigCacheGetConfigOptionBody = string;

export type ConfigCacheGetConfigOptionResponse = {
  Title: string;
  Key: string;
  Value: string;
  Disabled: boolean;
  Sort: number;
  Description: string;
  Options: {
    Title: string;
    Key: string;
    Value: string;
    Disabled: boolean;
    Sort: number;
    Description: string;
  }[];
};

export type ConfigCacheGetConfigOptionResponses = {
  200: ConfigCacheGetConfigOptionResponse;
};

export type MasterApproveExpectApproveListBody = {
  BelongTo: string;
  ServiceId: string;
};

export type MasterApproveExpectApproveListResponse = {
  /** 节点编号 */
  NodeNumber: string;
  /** 节点名称 */
  NodeName: string;
  /** 状态 */
  Status: string;
  Description?: string;
  /** 审批时间 */
  ApproveDate?: string;
  /** 进行中，已完成，未处理 */
  Condition: string;
  /** 审批人 */
  ApproveUsers?: {
    UserName?: string;
    JobName?: string;
    Avatar?: string;
  }[];
}[];

export type MasterApproveExpectApproveListResponses = {
  200: MasterApproveExpectApproveListResponse;
};

export type MasterApproveGetApproveModelBody = {
  /** 归属于哪个业务的流程 */
  BelongTo: string;
  /** 取业务id */
  ServiceId: string;
};

export type MasterApproveGetApproveModelResponse = {
  Id: string;
  ApproveNo: string;
  ApproveName: string;
  BelongTo: string;
  ServiceId: string;
  CreatedUserId: string;
  CreatedUserName: string;
  CreatedTime: string;
  NodeList: {
    Id?: string;
    ApproveId?: string;
    UserId?: string;
    UserName?: string;
    AvatarUrl?: string;
    ApproveDate?: string;
    Description?: string;
    NodeName?: string;
    NodeNumber?: string;
    NodeStatus?: string;
    Sort?: number;
    PrevNodeId?: string;
  }[];
};

export type MasterApproveGetApproveModelResponses = {
  200: MasterApproveGetApproveModelResponse;
};

export type MasterApproveSaveBody = {
  Operater: string;
  Model: {
    /** 节点id */
    Id: string;
    BelongTo: string;
    /** mdId */
    ServiceId: string;
    Status: string;
    /** 1：同意、2：退回到上一级、3：驳回 */
    OperateType: string;
    Description: string;
  };
};

export type MasterApproveSaveResponse = boolean;

export type MasterApproveSaveResponses = {
  200: MasterApproveSaveResponse;
};

export type MasterDeptGetDeptListByCompanyResponse = {
  Id: string;
  DeptNo: string;
  DeptName: string;
  OrgId: string;
  Status: string;
  Sort: number;
}[];

export type MasterDeptGetDeptListByCompanyResponses = {
  200: MasterDeptGetDeptListByCompanyResponse;
};

export type MasterGroupGetDeptListByGroupIdBody = string;

export type MasterGroupGetDeptListByGroupIdResponse = {
  Id: string;
  DeptNo: string;
  DeptName: string;
  GroupId: string;
  OrgId: string;
  IconSrc: string;
  ColorCode: string;
}[];

export type MasterGroupGetDeptListByGroupIdResponses = {
  200: MasterGroupGetDeptListByGroupIdResponse;
};

export type MasterGroupGroupListByCompanyResponse = {
  Id: string;
  GroupNo: string;
  GroupName: string;
  OrgId: string;
  CityId: string;
  PlanStartDay: string;
  WeekStartDay: string;
  Status: string;
  CreatedTime: string;
  Sort: number;
  Description?: string;
}[];

export type MasterGroupGroupListByCompanyResponses = {
  200: MasterGroupGroupListByCompanyResponse;
};

export type MasterMdGetCalenderByWeekMdBody = {
  /** 开始时间 */
  BeginDay: string;
  /** 结束时间 */
  EndDay: string;
  DeptId?: string;
};

export type MasterMdGetCalenderByWeekMdResponse = {
  Id: string;
  GroupId: string;
  DeptId: string;
  DeptSubject: string;
  DemandAnalysis: string;
  AdjustPlan: string;
  Policy: string;
  Year: number;
  WeekNumber: number;
  PlanStartDay: string;
  PlanEndDay: string;
  Status: string;
  MdBudgetItems: {
    Name: string;
    BudgetAmount: number;
    BudgetGrossProfitAmount: number;
    BudgetGrossProfitRate: number;
    SaleAmount: number;
    SaleCostAmount: number;
    SaleGrossProfitAmount: number;
    SaleGrossProfitRate: number;
    Level: number;
  }[];
  MdSkuItems: {
    Id: string;
    MdId: string;
    CategoryNo: string;
    CategoryName: string;
    SpuNo: string;
    SpuName: string;
    SkuNo: string;
    SkuName: string;
    RecommendType: string;
    PromotionMethod?: string;
  }[];
};

export type MasterMdGetCalenderByWeekMdResponses = {
  200: MasterMdGetCalenderByWeekMdResponse;
};

export type MasterMdGetMdListCalenderBody = {
  /** 分组ID
   */
  GroupId: string;
  PlanStartDay: string;
  PlanEndDay: string;
};

export type MasterMdGetMdListCalenderResponse = {
  DeptId: string;
  DeptName: string;
  KeyCategory?: string;
  /** 部门月度基本方针 */
  Policy?: string;
  MdData1: {
    Id: string;
    Status: string;
    SaleSummary: string;
    MdSkuItems: {
      Id: string;
      MdId: string;
      CategoryNo: string;
      CategoryName: string;
      SpuNo: string;
      SpuName: string;
      SkuNo: string;
      SkuName: string;
      Price: number;
      Num: number;
      LogoUrl: string;
      BudgetAmount: number;
      RecommendType: string;
    }[];
  };
  MdData2: {
    Id: string;
    Status: string;
    SaleSummary: string;
    MdSkuItems: {
      Id: string;
      MdId: string;
      CategoryNo: string;
      CategoryName: string;
      SpuNo: string;
      SpuName: string;
      SkuNo: string;
      SkuName: string;
      Price: number;
      Num: number;
      LogoUrl: string;
      BudgetAmount: number;
      RecommendType: string;
      PromotionMethod: string;
    }[];
  };
  MdData3: {
    Id: string;
    Status: string;
    SaleSummary: string;
    MdSkuItems: string[];
  };
  MdData4: {
    Id: string;
    Status: string;
    SaleSummary: string;
    MdSkuItems: string[];
  };
  MdData5: {
    Id: string;
    Status: string;
    SaleSummary: string;
    MdSkuItems: {
      Id: string;
      MdId: string;
      CategoryNo: string;
      CategoryName: string;
      SpuNo: string;
      SpuName: string;
      SkuNo: string;
      SkuName: string;
      Price: number;
      Num: number;
      LogoUrl: string;
      BudgetAmount: number;
      RecommendType: string;
    }[];
  };
}[];

export type MasterMdGetMdListCalenderResponses = {
  200: MasterMdGetMdListCalenderResponse;
};

export type MasterMdGetMdSkuViewBody = string;

export type MasterMdGetMdSkuViewResponse = {
  Id: string;
  MdId: string;
  /** 品类 */
  CategoryName: string;
  SpuName: string;
  SkuName: string;
  Price: number;
  Num: number;
  /** 销售预算 */
  BudgetAmount: number;
  /** 推荐理由 */
  RecommendType: string;
  /** 促销方式 */
  PromotionMethod: string;
  /** 商品特点 */
  SpuFeature: string;
  /** 其他 */
  Remark: string;
  /** 商品图片 */
  LogoUrl: string;
};

export type MasterMdGetMdSkuViewResponses = {
  200: MasterMdGetMdSkuViewResponse;
};

export type MasterMdGetMdViewBody = string;

export type MasterMdGetMdViewResponse = {
  Id: string;
  MdNo: string;
  GroupId: string;
  GroupNo: string;
  GroupName: string;
  OrgId: string;
  PlanStartDay: string;
  PlanEndDay: string;
  Year: number;
  WeekNumber: number;
  DeptId: string;
  DeptNo: string;
  DeptName: string;
  SaleSummary: string;
  BannerUrlList: string[];
  Status: string;
  CreatedUserId: string;
  CreatedTime: string;
  ActiveNum: number;
  MdBudgetItems: string[];
  MdSkuItems: string[];
  MdStatusItems: {
    StatusName: string;
    Status: string;
    Condition: string;
  }[];
};

export type MasterMdGetMdViewResponses = {
  200: MasterMdGetMdViewResponse;
};

export type MasterMdShopGetMdShopCalenderBody = {
  /** 店组ID */
  GroupId: string;
  /** 计划开始时间 */
  PlanStartDay: string;
  /** 计划结束时间 */
  PlanEndDay: string;
};

export type MasterMdShopGetMdShopCalenderResponse = {
  Id: string;
  DemandAnalysis: string;
  AdjustPlan: string;
  ActionPlan: string;
  Year: number;
  GroupId: string;
  MonthNumber: number;
  PlanStartDay: string;
  PlanEndDay: string;
  Status: string;
  /** 月销售预算 */
  MdBudgetItems: {
    /** 去年/今年 */
    Name: string;
    /** 预算额 */
    BudgetAmount: number;
    /** 预算毛利额 */
    BudgetGrossProfitAmount: number;
    /** 预算毛利率 */
    BudgetGrossProfitRate: number;
    /** 实际销售额 */
    SaleAmount: number;
    /** 销售成本金额 */
    SaleCostAmount?: number;
    /** 销售毛利额 */
    SaleGrossProfitAmount?: number;
    /** 销售总利润率 */
    SaleGrossProfitRate?: number;
    Level: number;
  }[];
  Items: {
    WeekNumber: number;
    Subject: string;
    DemandAnalysis: string;
    BannerUrlList: string[];
  }[];
  MdItems: {
    DeptId: string;
    DeptName: string;
    /** 部门月度基本方针 */
    Policy?: string;
    MdData1: {
      Id: string;
      /** 周部门主题 */
      DeptSubject?: string;
    };
    MdData2: {
      Id: string;
      /** 周部门主题 */
      DeptSubject?: string;
    };
    MdData3: {
      Id: string;
      /** 周部门主题 */
      DeptSubject?: string;
    };
    MdData4: {
      Id: string;
      /** 周部门主题 */
      DeptSubject?: string;
    };
    MdData5: {
      Id: string;
      /** 周部门主题 */
      DeptSubject?: string;
    };
  }[];
};

export type MasterMdShopGetMdShopCalenderResponses = {
  200: MasterMdShopGetMdShopCalenderResponse;
};

export type MasterMdShopGetMdShopViewBody = string;

export type MasterMdShopGetMdShopViewResponse = {
  Id: string;
  MdShopNo: string;
  GroupId: string;
  GroupNo: string;
  GroupName: string;
  OrgId: string;
  PlanStartDay: string;
  PlanEndDay: string;
  Year: number;
  MonthNumber: number;
  DemandAnalysis: string;
  AdjustPlan: string;
  ActionPlan: string;
  SaleAmount: number;
  GrossProfitAmount: number;
  GrossProfitRate: number;
  Status: string;
  CreatedUserId: string;
  CreatedTime: string;
  ActiveNum: number;
  Items: {
    WeekNumber: number;
    Subject: string;
    BannerUrlList: string[];
  }[];
  MdBudgetItems: {
    Name: string;
    SaleAmount: number;
    GrossProfitAmount: number;
    GrossProfitRate: number;
    Level: number;
  }[];
  MdItems: {
    Id: string;
    MdNo: string;
    GroupId: string;
    GroupNo: string;
    GroupName: string;
    OrgId: string;
    PlanStartDay: string;
    PlanEndDay: string;
    Year: number;
    WeekNumber: number;
    DeptId: string;
    DeptNo: string;
    DeptName: string;
    BannerUrlList: string[];
    Status: string;
    CreatedUserId: string;
    CreatedTime: string;
    ActiveNum: number;
    TaskItems: string[];
    MdBudgetItems: {
      Name: string;
      SaleAmount: number;
      GrossProfitAmount: number;
      GrossProfitRate: number;
      Level: number;
    }[];
    MdSkuItems: string[];
  }[];
  MdStatusItems: {
    StatusName: string;
    Status: string;
    Condition: string;
  }[];
  TaskItems: {
    Id: string;
    TaskNo: string;
    Title: string;
    TaskType: string;
    Status: string;
  }[];
};

export type MasterMdShopGetMdShopViewResponses = {
  200: MasterMdShopGetMdShopViewResponse;
};

export type MasterMdShopUpdateSummaryBody = {
  Id: string;
  PlanSummary: string;
};

export type MasterMdShopUpdateSummaryResponse = boolean;

export type MasterMdShopUpdateSummaryResponses = {
  200: MasterMdShopUpdateSummaryResponse;
};

export type MasterMdStoreGetMdStoreCalenderBody = {
  /** 分组 */
  GroupId: string;
  /** 计划开始时间 */
  PlanStartDay: string;
  /** 计划结束时间 */
  PlanEndDay: string;
};

export type MasterMdStoreGetMdStoreCalenderResponse = {
  Id: string;
  MdShopNo: string;
  GroupId: string;
  GroupNo: string;
  GroupName: string;
  OrgId: string;
  PlanStartDay: string;
  PlanEndDay: string;
  Year: number;
  MonthNumber: number;
  PlanSummary: string;
  Priorities1: string;
  Priorities2: string;
  MeetFocus: string;
  Status: string;
  CreatedUserId: string;
  CreatedTime: string;
  ActiveNum: number;
  MdBudgetItems: {
    Name: string;
    BudgetAmount: number;
    BudgetGrossProfitAmount: number;
    BudgetGrossProfitRate: number;
    SaleAmount: number;
    SaleCostAmount: number;
    SaleGrossProfitAmount: number;
    SaleGrossProfitRate: number;
    Level: number;
  }[];
  MdStatusItems: {
    StatusName: string;
    Status: string;
    Condition: string;
  }[];
  MdItems: {
    DeptId: string;
    DeptName: string;
    KeyCategory: string;
    MdData1: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: {
        Id?: string;
        MdId?: string;
        SpuNo?: string;
        SpuName?: string;
        LogoUrl?: string;
      }[];
    };
    MdData2: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: string[];
    };
    MdData3: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: string[];
    };
    MdData4: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: string[];
    };
    MdData5: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: string[];
    };
  }[];
};

export type MasterMdStoreGetMdStoreCalenderResponses = {
  200: MasterMdStoreGetMdStoreCalenderResponse;
};

export type MasterMdStoreGetMdStoreViewBody = string;

export type MasterMdStoreGetMdStoreViewResponse = {
  Id: string;
  MdShopNo: string;
  GroupId: string;
  GroupNo: string;
  GroupName: string;
  OrgId: string;
  PlanStartDay: string;
  PlanEndDay: string;
  Year: number;
  MonthNumber: number;
  PlanSummary: string;
  Priorities1: string;
  Priorities2: string;
  MeetFocus: string;
  Status: string;
  CreatedUserId: string;
  CreatedTime: string;
  ActiveNum: number;
  MdBudgetItems: {
    Name: string;
    BudgetAmount: number;
    BudgetGrossProfitAmount: number;
    BudgetGrossProfitRate: number;
    SaleAmount: number;
    SaleCostAmount: number;
    SaleGrossProfitAmount: number;
    SaleGrossProfitRate: number;
    Level: number;
  }[];
  MdItems: {
    DeptId: string;
    DeptName: string;
    KeyCategory: string;
    MdData1: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: {
        Id: string;
        MdId: string;
        CategoryNo: string;
        CategoryName: string;
        SpuNo: string;
        SpuName: string;
        SkuNo: string;
        Price: number;
        Num: number;
        LogoUrl: string;
        BudgetAmount: number;
        RecommendType: string;
      }[];
    };
    MdData2: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: string[];
    };
    MdData3: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: string[];
    };
    MdData4: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: string[];
    };
    MdData5: {
      Id: string;
      SaleSummary: string;
      MdSkuItems: {
        Id: string;
        MdId: string;
        CategoryNo: string;
        CategoryName: string;
        SpuNo: string;
        SpuName: string;
        SkuNo: string;
        Price: number;
        Num: number;
        LogoUrl: string;
        BudgetAmount: number;
        RecommendType: string;
      }[];
    };
  }[];
};

export type MasterMdStoreGetMdStoreViewResponses = {
  200: MasterMdStoreGetMdStoreViewResponse;
};

export type MasterMdSummaryGetMdSummaryViewBody = string;

export type MasterMdSummaryGetMdSummaryViewResponse = {
  TagIds: string[];
  GroupId: string;
  OrgId: string;
  PlanStartDay: string;
  PlanEndDay: string;
  DeptId: string;
  CreatedJobName: string;
  Optimize: string;
  Satisfied: number;
  SatisfiedStatement: string;
  Tags: string;
  Id: string;
  TenantId: string;
  Version: number;
  IsDeleted: boolean;
  CreatedUserId: string;
  CreatedUserName: string;
  CreatedTime: string;
};

export type MasterMdSummaryGetMdSummaryViewResponses = {
  200: MasterMdSummaryGetMdSummaryViewResponse;
};

export type MasterMdSummaryGetPageQueryMdSummaryBody = {
  IsNotPage: boolean;
  FilterItems: {
    Field: string;
    Value: string;
    OperatorSql?: string;
    Operator?: string;
    Type?: string;
    LeftBrackets?: string;
    RigthBrackets?: string;
  }[];
  OrderBys: {
    Field?: string;
    Order?: string;
  }[];
  CurrentPage: number;
  PageSize: number;
};

export type MasterMdSummaryGetPageQueryMdSummaryResponse = {
  Data: {
    MdId: string;
    MdNo: string;
    GroupId: string;
    GroupNo: string;
    GroupName: string;
    PlanStartDay: string;
    PlanEndDay: string;
    YearNumber: number;
    MonthNumber: number;
    AverageScore: number;
    /** 评分 */
    ScoreNumber: number;
    /** 标签id集合 */
    TagIdList: string[];
    /** 标签 */
    Tags?: string;
    Status: string;
    /** 计划制定人总结 */
    PlanSummary?: string;
    /** 部门复盘（部门id） */
    DeptId?: string;
    DeptName?: string;
    DeptNo?: string;
    /** 计划属于第几周 */
    WeekNumber?: string;
  }[];
  CurrentPage: number;
  PageSize: number;
  PageCount: number;
  RowsCount: number;
};

export type MasterMdSummaryGetPageQueryMdSummaryResponses = {
  200: MasterMdSummaryGetPageQueryMdSummaryResponse;
};

export type MasterMdSummaryGetSummaryListByMdBody = {
  GroupId: string;
  DeptId?: string;
  BeginDay: string;
  EndDay: string;
};

export type MasterMdSummaryGetSummaryListByMdResponse = {
  Id?: string;
  GroupId?: string;
  OrgId?: string;
  PlanStartDay?: string;
  PlanEndDay?: string;
  DeptId?: string;
  CreatedTime?: string;
  CreatedUserId?: string;
  CreatedUserName?: string;
  CreatedJobName?: string;
  CreatedShopId?: string;
  CreatedShopNo?: string;
  CreatedShopName?: string;
  Optimize?: string;
  Satisfied?: number;
  SatisfiedStatement?: string;
  Tags?: string;
  TagIds?: string[];
}[];

export type MasterMdSummaryGetSummaryListByMdResponses = {
  200: MasterMdSummaryGetSummaryListByMdResponse;
};

export type MasterMdSummarySaveBody = {
  Operater: string;
  Model: {
    GroupId: string;
    PlanStartDay?: string;
    PlanEndDay?: string;
    DeptId?: string;
    Optimize?: string;
    Satisfied?: number;
    SatisfiedStatement?: string;
    TagIds?: string[];
  };
};

export type MasterMdSummarySaveResponse = boolean;

export type MasterMdSummarySaveResponses = {
  200: MasterMdSummarySaveResponse;
};

export type MasterReviewGetReviewViewBody = string;

export type MasterReviewGetReviewViewResponse = {
  Id: string;
  ReviewNo: string;
  OrgId: string;
  GroupId: string;
  ShopId: string;
  DeptId: string;
  Title: string;
  ReviewType: string;
  ReviewDay: string;
  ColumnAtlas: string;
  Description: string;
  CreatedTime: string;
  CreatedUserId: string;
  CreatedUserName: string;
  ReplyItems: {
    ReviewReplyId?: string;
    ReviewId?: string;
    Replycontent?: string;
    CreatedUserId?: string;
    CreatedUserName?: string;
    CreatedTime?: string;
    AvatarUrl?: string;
    JobName?: string;
  }[];
  /** 状态 */
  ReviewStatus: string;
};

export type MasterReviewGetReviewViewResponses = {
  200: MasterReviewGetReviewViewResponse;
};

export type MasterReviewQueryReviewBody = {
  IsNotPage: boolean;
  FilterItems: {
    /** 字段名 */
    Field: string;
    /** 值 */
    Value: string;
    /** 匹配条件 */
    OperatorSql?: string;
    /** 匹配条件2 */
    Operator?: string;
    /** 类型 */
    Type?: string;
  }[];
  OrderBys?: {
    Field?: string;
    Order?: string;
  }[];
  CurrentPage: number;
  PageSize: number;
};

export type MasterReviewQueryReviewResponse = {
  Data: {
    Id: string;
    ReviewNo: string;
    GroupId: string;
    ShopId: string;
    DeptId: string;
    OrgId: string;
    Title: string;
    /** 类型 */
    ReviewType: string;
    /** 状态 */
    ReviewStatus: string;
    /** 笔记时间 */
    ReviewDay: string;
    ColumnAtlas: string;
    CreatedTime: string;
    CreatedUserId: string;
    CreatedUserName: string;
    Tags: string;
  }[];
  CurrentPage: number;
  PageSize: number;
  PageCount: number;
  RowsCount: number;
};

export type MasterReviewQueryReviewResponses = {
  200: MasterReviewQueryReviewResponse;
};

export type MasterReviewReviewCalenderListBody = {
  GroupId: string;
  DeptId?: string;
  BeginDay: string;
  EndDay: string;
};

export type MasterReviewReviewCalenderListResponse = Record<string, unknown>;

export type MasterReviewReviewCalenderListResponses = {
  200: MasterReviewReviewCalenderListResponse;
};

export type MasterReviewSaveBody = {
  /** Add/Edit */
  Operater: string;
  Model: {
    Id?: string;
    GroupId?: string;
    ShopId?: string;
    DeptId?: string;
    Title?: string;
    ReviewType?: string;
    ReviewDay?: string;
    ColumnAtlas?: string;
    Description?: string;
  };
};

export type MasterReviewSaveResponse = Record<string, unknown>;

export type MasterReviewSaveResponses = {
  200: MasterReviewSaveResponse;
};

export type MasterReviewSaveReviewReplyBody = {
  ReviewId: string;
  Replycontent: string;
};

export type MasterReviewSaveReviewReplyResponse = boolean;

export type MasterReviewSaveReviewReplyResponses = {
  200: MasterReviewSaveReviewReplyResponse;
};

export type MasterShopCalendarGetShopCalendarListBody = {
  BeginDay: string;
  EndDay: string;
};

export type MasterShopCalendarGetShopCalendarListResponse = {
  Id: string;
  OrgId: string;
  BeginDay: string;
  EndDay: string;
  Holidays: string;
}[];

export type MasterShopCalendarGetShopCalendarListResponses = {
  200: MasterShopCalendarGetShopCalendarListResponse;
};

export type MasterShopGetShopListResponse = {
  Id: string;
  ShopNo: string;
  ShopName: string;
  UserId: string;
  GroupId: string;
  OrgId: string;
  CityId: string;
}[];

export type MasterShopGetShopListResponses = {
  200: MasterShopGetShopListResponse;
};

export type MasterShopGetShopViewBody = string;

export type MasterShopGetShopViewResponse = {
  Id: string;
  ShopNo: string;
  ShopName: string;
  GroupId: string;
  ShopStatus: string;
  ShopType: string;
  OrgId: string;
  UserId: string;
  UserName: string;
  CityId: string;
  CompanyAddress: string;
  Company: string;
  Sort: number;
  ShopGroupModel: {
    Id: string;
    GroupNo: string;
    GroupName: string;
    OrgId: string;
    OrgName: string;
    CityId: string;
    PlanStartDay: string;
    WeekStartDay: string;
    Format: string;
    Status: string;
    CreatedTime: string;
    Sort: number;
    Description: string;
  };
};

export type MasterShopGetShopViewResponses = {
  200: MasterShopGetShopViewResponse;
};

export type MasterShopShopUserListByCompanyResponse = {
  UserId: string;
  UserName: string;
}[];

export type MasterShopShopUserListByCompanyResponses = {
  200: MasterShopShopUserListByCompanyResponse;
};

export type MasterTagGetTagListByTypeBody = string;

export type MasterTagGetTagListByTypeResponse = {
  TagName?: string;
  OrgId?: string;
  TagType?: string;
  Status?: string;
  Id?: string;
  TenantId?: string;
  Version?: number;
  IsDeleted?: boolean;
  CreatedUserId?: string;
  CreatedUserName?: string;
  CreatedTime?: string;
}[];

export type MasterTagGetTagListByTypeResponses = {
  200: MasterTagGetTagListByTypeResponse;
};

export type MasterTaskGetTaskStatusCountListResponse = {
  Status: number;
  StatusName: string;
  Count: number;
}[];

export type MasterTaskGetTaskStatusCountListResponses = {
  200: MasterTaskGetTaskStatusCountListResponse;
};

export type MasterTaskGetTaskViewBody = string;

export type MasterTaskGetTaskViewResponse = {
  Id: string;
  OrgId: string;
  GroupId: string;
  GroupName: string;
  ShopId: string;
  ShopName: string;
  DeptId: string;
  DeptName: string;
  PlanStartDay: string;
  PlanEndDay: string;
  MdId: string;
  MdNo: string;
  PlanCycle: string;
  ServiceType: string;
  TaskNo: string;
  TaskType: string;
  Title: string;
  BeginDay: string;
  EndDay: string;
  ActualBeginDay: string;
  ActualEndDay: string;
  Description: string;
  Status: string;
  Priority: string;
  HeadUserScore: number;
  HeadUserRemark: string;
  CreatedTime: string;
  CreatedUserId: string;
  CreatedUserName: string;
  CreatedUserScore: number;
  CreatedUserRemark: string;
  TagIds: string[];
  UserItems: {
    TaskId?: string;
    UserId?: string;
    UserName?: string;
    IsHeadUser?: boolean;
    AvatarUrl?: string;
  }[];
  ReplyItems: {
    TaskReplyId?: string;
    TaskId?: string;
    Replycontent?: string;
    CreatedUserId?: string;
    CreatedUserName?: string;
    CreatedTime?: string;
    AvatarUrl?: string;
    JobName?: string;
  }[];
  OperateLogItems: {
    TaskLogId?: string;
    TaskId?: string;
    Operatecontent?: string;
    CreatedUserId?: string;
    CreatedUserName?: string;
    CreatedTime?: string;
  }[];
};

export type MasterTaskGetTaskViewResponses = {
  200: MasterTaskGetTaskViewResponse;
};

export type MasterTaskQueryMyToDoTaskBody = {
  /** true：不分页，false：分页 */
  IsNotPage: boolean;
  FilterItems: {
    /** 数据库字段名 */
    Field: string;
    Value: string;
    Type?: string;
    /** sql判断条件（后续只使用当前参数） */
    Operator?: string;
    /** 或者 */
    Logical?: number;
  }[];
  /** 排序条件 */
  OrderBys?: {
    /** 数据库字段名 */
    Field?: string;
    /** 0：Asc，1：Desc */
    Order?: string;
  }[];
  CurrentPage: number;
  PageSize: number;
};

export type MasterTaskQueryMyToDoTaskByAppBody = {
  IsNotPage: boolean;
  FilterItems: {
    Field: string;
    Value: string;
    OperatorSql?: string;
    Operator?: string;
    Type?: string;
    LeftBrackets?: string;
    RigthBrackets?: string;
  }[];
  OrderBys?: {
    Field?: string;
    Order?: string;
  }[];
  CurrentPage?: number;
  PageSize?: number;
};

export type MasterTaskQueryMyToDoTaskByAppResponse = {
  MdId?: string;
  MdNo?: string;
  ServiceType?: string;
  PlanStartDay?: string;
  PlanEndDay?: string;
  GroupNo?: string;
  GroupName?: string;
  YearNumber?: number;
  MonthNumber?: number;
  TaskItems?: {
    Id?: string;
    ShopId?: string;
    ShopNo?: string;
    ShopName?: string;
    TaskNo?: string;
    TaskType?: string;
    Title?: string;
    BeginDay?: string;
    EndDay?: string;
    Status?: string;
    Priority?: string;
  }[];
}[];

export type MasterTaskQueryMyToDoTaskByAppResponses = {
  200: MasterTaskQueryMyToDoTaskByAppResponse;
};

export type MasterTaskQueryMyToDoTaskResponse = {
  Data: {
    Id: string;
    OrgId: string;
    GroupId: string;
    GroupNo: string;
    GroupName: string;
    ShopId: string;
    ShopNo: string;
    ShopName: string;
    DeptId: string;
    DeptNo: string;
    DeptName: string;
    TaskNo: string;
    TaskType: string;
    Title: string;
    MdId: string;
    MdNo: string;
    PlanStartDay: string;
    PlanEndDay: string;
    ServiceType: string;
    BeginDay: string;
    EndDay: string;
    Status: string;
    Priority: string;
    HeadUserScore: number;
    CreatedUserId: string;
    CreateUserScore: number;
    CreatedUserName: string;
    CreatedTime: string;
    /** 发布状态 */
    PublishStatus: string;
  }[];
  CurrentPage: number;
  PageSize: number;
  PageCount: number;
  RowsCount: number;
};

export type MasterTaskQueryMyToDoTaskResponses = {
  200: MasterTaskQueryMyToDoTaskResponse;
};

export type MasterTaskQueryTaskBody = {
  /** 是否分页 false 为分页 true 为不分页 */
  IsNotPage: boolean;
  /** 过滤查询条件 */
  FilterItems: {
    /** 后端根据该字段检索 */
    Field: string;
    Value: string;
    Type?: string;
    Operator: string;
  }[];
  /** 排序条件 */
  OrderBys?: {
    Field?: string;
    Order?: number;
  }[];
  CurrentPage: number;
  PageSize: number;
};

export type MasterTaskQueryTaskResponse = {
  Data: {
    Id: string;
    OrgId: string;
    ShopId: string;
    ShopName: string;
    TaskNo: string;
    TaskType: string;
    Title: string;
    MdId: string;
    MdShopNo: string;
    PlanStartDay: string;
    PlanEndDay: string;
    ServiceType: string;
    BeginDay: string;
    EndDay: string;
    Status: string;
    Priority: string;
    HeadUserId: string;
  }[];
  CurrentPage: number;
  PageSize: number;
  PageCount: number;
  RowsCount: number;
};

export type MasterTaskQueryTaskResponses = {
  200: MasterTaskQueryTaskResponse;
};

export type MasterTaskReplySaveBody = {
  /** Add/Edit */
  Operater: string;
  Model: {
    TaskId: string;
    Replycontent: string;
  };
};

export type MasterTaskReplySaveResponse = Record<string, unknown>;

export type MasterTaskReplySaveResponses = {
  200: MasterTaskReplySaveResponse;
};

export type MasterTaskSaveBody = {
  /** 保存类型，Add,Edit */
  Operater: string;
  Model: {
    Id?: string;
    MdId: string;
    TaskType: string;
    TaskNo?: string;
    Title: string;
    BeginDay?: string;
    EndDay?: string;
    Description?: string;
    Status?: string;
    /** 发布状态 */
    PublishStatus: string;
    Progress?: string;
    /** 优先级 */
    Priority: string;
    BackgroundColor?: string;
    /** 负责人 */
    UserId: string;
    /** 协助人 */
    Users?: string[];
  };
};

export type MasterTaskSaveResponse = Record<string, unknown>;

export type MasterTaskSaveResponses = {
  200: MasterTaskSaveResponse;
};

export type MasterTaskSaveStatusBody = {
  Operater: string;
  Model: {
    TaskId: string;
    Status: string;
  };
};

export type MasterTaskSaveStatusResponse = boolean;

export type MasterTaskSaveStatusResponses = {
  200: MasterTaskSaveStatusResponse;
};

export type MasterUserGetGroupAndShopAndDeptListByUserIdBody = string;

export type MasterUserGetGroupAndShopAndDeptListByUserIdResponse = {
  GroupId: string;
  GroupNo: string;
  GroupName: string;
  ShopItems: {
    ShopId: string;
    ShopNo: string;
    ShopName: string;
    DeptItems: {
      DeptId: string;
      DeptNo: string;
      DeptName: string;
    }[];
  }[];
  DeptItems: {
    DeptId: string;
    DeptNo: string;
    DeptName: string;
  }[];
}[];

export type MasterUserGetGroupAndShopAndDeptListByUserIdResponses = {
  200: MasterUserGetGroupAndShopAndDeptListByUserIdResponse;
};

export type MasterUserGetGroupListByUserIdBody = string;

export type MasterUserGetGroupListByUserIdResponse = {
  Id: string;
  GroupNo: string;
  GroupName: string;
  OrgId: string;
  CityId: string;
  PlanStartDay: string;
  WeekStartDay: string;
  Format: string;
  Status: string;
  CreatedTime: string;
  Sort: number;
  Description?: string;
  CityModel: {
    Id: string;
    ParentId: string;
    Province: string;
    Name: string;
    City: string;
    Area: string;
    Latitude: number;
    Longitude: number;
  };
  DeptList: {
    Id: string;
    DeptNo: string;
    DeptName: string;
    GroupId: string;
    OrgId: string;
    IconSrc: string;
    ColorCode: string;
  }[];
}[];

export type MasterUserGetGroupListByUserIdResponses = {
  200: MasterUserGetGroupListByUserIdResponse;
};

export type MasterUserGetUserModelResponse = {
  Id: string;
  UserName: string;
  OrgId: string;
  ShopId: string;
  Jobs: string;
  JobName: string;
  JobItems: {
    Id?: string;
    JobNo?: string;
    JobName?: string;
    Sort?: number;
    JobShopItems?: {
      Id?: string;
      ShopNo?: string;
      ShopName?: string;
      GroupId?: string;
      Depts?: string;
      JobShopDeptItems?: {
        Id: string;
        DeptNo: string;
        DeptName: string;
      }[];
    }[];
  }[];
};

export type MasterUserGetUserModelResponses = {
  200: MasterUserGetUserModelResponse;
};

export type MasterUserQueryShopListResponse = {
  ShopId: string;
  ShopNo: string;
  ShopName: string;
  ShopType: string;
  OrgId: string;
  ShopGroupId: string;
  CityId: string;
  CityModel: {
    Id: string;
    Latitude: number;
    Longitude: number;
    ParentId: string;
    Province: string;
    City: string;
    Area: string;
  };
  ParentId?: string;
  Items?: {
    ParentId: string;
    ShopId: string;
    ShopNo: string;
    ShopName: string;
    ShopType: string;
    OrgId: string;
    ShopGroupId: string;
    CityId: string;
    CityModel: {
      Id: string;
      ParentId: string;
      Province: string;
      City: string;
      Area: string;
      Latitude: number;
      Longitude: number;
    };
    Items: string[];
  }[];
}[];

export type MasterUserQueryShopListResponses = {
  200: MasterUserQueryShopListResponse;
};

export type NoticeGetMyNoticeCountResponse = number;

export type NoticeGetMyNoticeCountResponses = {
  200: NoticeGetMyNoticeCountResponse;
};

export type NoticeGetMyNoticeListBody = {
  CurrentPage: number;
  FilterItems: {
    Field?: string;
    OperatorSql?: string;
    Value?: string;
  }[];
  IsNotPage: boolean;
  PageSize: number;
};

export type NoticeGetMyNoticeListResponse = {
  Data: {
    Id: string;
    OrgId: string;
    OrgCode: string;
    OrgName: string;
    NoticeNo: string;
    NoticeType: string;
    NoticeTypeIcon: string;
    Title: string;
    NoticeTime: string;
    Message: string;
    IsRead: boolean;
  }[];
  CurrentPage: number;
  PageSize: number;
  PageCount: number;
  RowsCount: number;
};

export type NoticeGetMyNoticeListResponses = {
  200: NoticeGetMyNoticeListResponse;
};

export type NoticeSetNoticeReadBody = string;

export type NoticeSetNoticeReadResponse = Record<string, unknown>;

export type NoticeSetNoticeReadResponses = {
  200: NoticeSetNoticeReadResponse;
};

export type OrgGetMyOrgListResponse = {
  Id: string;
  OrgName: string;
  OrgCode: string;
  Abbreviate: string;
  CityId: string;
  CityName: string;
  LogoUrl: string;
  BusinessLicense: string;
  Linkman: string;
  LinkPhone: string;
  LinkEmail: string;
  LinkAddress: string;
  ApproveStatus: string;
  Selected: boolean;
  PlanStartDay: string;
  WeekStartDay: string;
}[];

export type OrgGetMyOrgListResponses = {
  200: OrgGetMyOrgListResponse;
};

export type PackageGetPublishedResponse = {
  Type?: string;
  AppId?: string;
  ApplyName?: string;
  Title?: string;
  Content?: string;
  Platform?: string;
  CurrVersion?: string;
  AppVersion?: string;
  AppUrl?: string;
  IsSilent?: boolean;
  IsForce?: boolean;
  IsPublish?: boolean;
  Id?: string;
  TenantId?: string;
  Version?: number;
  IsDeleted?: boolean;
  CreatedTime?: string;
  ModifiedUserId?: string;
  ModifiedUserName?: string;
  ModifiedTime?: string;
}[];

export type PackageGetPublishedResponses = {
  200: PackageGetPublishedResponse;
};

export type PackagePageQueryResponse = Record<string, unknown>;

export type PackagePageQueryResponses = {
  200: PackagePageQueryResponse;
};

export type PackageSaveBody = {
  /** Add/Edit */
  Operater: string;
  Model: {
    AppId: string;
    ApplyName: string;
    Title: string;
    Content: string;
    Platform: string;
    /** 版本号 */
    CurrVersion: string;
    /** 原生App最 低版本 */
    AppVersion: string;
    AppUrl: string;
    /** 是否静默更新 */
    IsSilent: boolean;
    /** 是否强制更新 */
    IsForce: boolean;
    /** 上线发行 */
    IsPublish: boolean;
    Id?: string;
    TenantId?: string;
    Version?: number;
    IsDeleted?: boolean;
    CreatedUserId?: string;
    CreatedUserName?: string;
    CreatedTime?: string;
    ModifiedUserId?: string;
    ModifiedUserName?: string;
    ModifiedTime?: string;
  };
};

export type PackageSaveResponse = Record<string, unknown>;

export type PackageSaveResponses = {
  200: PackageSaveResponse;
};

export type PlateConfigGetBody = string;

export type PlateConfigGetResponse = {
  PlateName: string;
  Status: string;
  DataSource: string;
  PlateFilter: string;
  PlateConfigJson: string;
  Sort: number;
  Description: string;
  Id: string;
  TenantId: string;
  Version: number;
  IsDeleted: boolean;
  CreatedUserId: string;
  CreatedUserName: string;
  CreatedTime: string;
  ModifiedUserId: string;
  ModifiedUserName: string;
  ModifiedTime: string;
};

export type PlateConfigGetResponses = {
  200: PlateConfigGetResponse;
};

export type ReportGetReportDataBody = {
  ReportId: string;
};

export type ReportGetReportDataResponse = Record<string, unknown>;

export type ReportGetReportDataResponses = {
  200: ReportGetReportDataResponse;
};

export type ReportGetReportViewBody = {
  ReportId: string;
};

export type ReportGetReportViewResponse = {
  ReportId: string;
  ReportName: string;
  ReportFilter: string;
  ReportOptions: string;
};

export type ReportGetReportViewResponses = {
  200: ReportGetReportViewResponse;
};

export type ReportMenuPageQueryBody = {
  IsNotPage: boolean;
  FilterItems: {
    Field?: string;
    Value?: string;
    Operator?: string;
  }[];
  OrderBys?: {
    Field?: string;
    Order?: number;
    ParentFields?: string[];
  }[];
  CurrentPage?: number;
  PageSize?: number;
};

export type ReportMenuPageQueryResponse = {
  Data: {
    Id: string;
    ParentId: string;
    MenuTitle: string;
    MenuLink: string;
    MenuId: string;
    Status: string;
    MenuType: string;
    Sort: number;
    Description: string;
  }[];
  CurrentPage: number;
  PageSize: number;
  PageCount: number;
  RowsCount: number;
};

export type ReportMenuPageQueryResponses = {
  200: ReportMenuPageQueryResponse;
};

export type RuleGetUserPermissionBody = string;

export type RuleGetUserPermissionResponse = string[];

export type RuleGetUserPermissionResponses = {
  200: RuleGetUserPermissionResponse;
};

export type SendMessageBody = {
  cids: string[];
  title: string;
  content: string;
  request_id: string;
  payload: {
    parameter: string;
    type: string;
  };
};

export type SendMessageResponse = Record<string, unknown>;

export type SendMessageResponses = {
  200: SendMessageResponse;
};

export type SmsSendVerifyCodeBody = {
  Phone: string;
  /** 登录，注册，忘记密码 */
  MsgType: string;
};

export type SmsSendVerifyCodeResponse = Record<string, unknown>;

export type SmsSendVerifyCodeResponses = {
  200: SmsSendVerifyCodeResponse;
};

export type UploadTCosGetCredentialResponse = {
  Data: {
    Bucket: string;
    Region: string;
    Token: string;
    TmpSecretId: string;
    TmpSecretKey: string;
    StartTime: string;
    ExpiredTime: string;
  };
  Code: string;
  Message: string;
};

export type UploadTCosGetCredentialResponses = {
  200: UploadTCosGetCredentialResponse;
};

export type UserChangePasswordBody = {
  Id: string;
  OldPassword: string;
  NewPassword: string;
  /** 确认密码 */
  ConfirmPassword: string;
};

export type UserChangePasswordResponse = Record<string, unknown>;

export type UserChangePasswordResponses = {
  200: UserChangePasswordResponse;
};

export type UserForgetPasswordBody = {
  Phone: string;
  VerifyCode: string;
  NewPassword: string;
  ConfirmPassword: string;
};

export type UserForgetPasswordResponse = Record<string, unknown>;

export type UserForgetPasswordResponses = {
  200: UserForgetPasswordResponse;
};

export type UserGetBody = string;

export type UserGetResponse = {
  OrgName: string;
  Name: string;
  Phone: string;
  Email: string;
  Status: string;
  JobNo: string;
  UserName: string;
  Avatar: string;
  Description: string;
  OrgId: string;
  UserType: string;
  JobName: string;
  Id: string;
  TenantId: string;
  Version: number;
  IsDeleted: boolean;
  CreatedUserId: string;
  CreatedUserName: string;
  CreatedTime: string;
  ModifiedUserId: string;
  ModifiedUserName: string;
  ModifiedTime: string;
};

export type UserGetResponses = {
  200: UserGetResponse;
};

export type UserSaveBody = {
  Operater: string;
  Model: {
    /** 展示的名称 */
    Name?: string;
    /** 手机号 */
    Phone?: string;
    /** 邮箱 */
    Email?: string;
    /** 账号编号 */
    UserName: string;
    /** 头像 */
    Avatar?: string;
    Id: string;
  };
};

export type UserSaveResponse = Record<string, unknown>;

export type UserSaveResponses = {
  200: UserSaveResponse;
};

export type UserVerifyAppBody = string;

export type UserVerifyAppResponse = Record<string, unknown>;

export type UserVerifyAppResponses = {
  200: UserVerifyAppResponse;
};

export type WeatherGetOpenMeteoBody = {
  hourly?: string[];
  daily?: string[];
  start_date: string;
  end_date: string;
  /** 经度 */
  latitude: number;
  /** 纬度 */
  longitude: number;
  /** 相对当前时间是否为历史 */
  ishistory?: boolean;
};

export type WeatherGetOpenMeteoResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
    weather_code: string;
  };
  hourly: {
    time: string[];
    temperature_2m: (number | number)[];
    weather_code: number[];
  };
  daily_units: {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

export type WeatherGetOpenMeteoResponses = {
  200: WeatherGetOpenMeteoResponse;
};
