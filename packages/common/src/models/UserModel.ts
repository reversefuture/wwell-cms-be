export enum IRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  username?: string;
  activationCode: string;
  imageUrl?: string;
  ossId?: string;
  walletKey?: string;
  roles: IRole[];
  referralCode?: string;
  termsAccepted: boolean;
  otpCounter?: string;
  otpSecret?: string;
  fcmToken?: string;
  device?: string;
  lastLoginTime?: Date;
  preferredLanguage: string;
  enableBiometric: boolean;
  selectedCountry: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  baseMint?: string;
  baseMintDecimals?: number;
  stopLoss?: number;
  takeProfit?: number;
  amountPerTrade?: number;    // 单笔交易金额, $
  slippageBps?: number; // Jupiter 交易滑点最大值, 单位0.01%
  priorityMaxLamports?: number; // Jupiter PriorityFeeWithMaxLamports
  priorityLevel?: string; // Jupiter PriorityFeeWithMaxLamportsPriorityLevelEnum: medium, high,veryHigh
  isAutoTradingEnabled?: boolean; // 是否自动交易
  requireConfirmation?: boolean; // 是否需要二次确认
}
