
import { MerchantVerification, MerchantVerificationModel } from "@/types";
import { toMerchantModel } from "./merchantConverters";

export function toMerchantVerificationModel(verification: MerchantVerification): MerchantVerificationModel {
  return {
    id: verification.id,
    merchantId: verification.merchant_id,
    verificationType: verification.verification_type,
    isVerified: verification.is_verified,
    verificationData: verification.verification_data,
    verifiedAt: verification.verified_at,
    createdAt: verification.created_at,
    updatedAt: verification.updated_at,
    merchant: verification.merchant ? toMerchantModel(verification.merchant) : undefined
  };
}

export function toMerchantVerificationEntity(model: MerchantVerificationModel): MerchantVerification {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    verification_type: model.verificationType,
    is_verified: model.isVerified,
    verification_data: model.verificationData,
    verified_at: model.verifiedAt,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    merchant: model.merchant ? undefined : undefined // Don't try to convert back merchant data
  };
}

export function toMerchantVerificationModels(verifications: MerchantVerification[]): MerchantVerificationModel[] {
  return verifications.map(verification => toMerchantVerificationModel(verification));
}

export function toMerchantVerificationEntities(models: MerchantVerificationModel[]): MerchantVerification[] {
  return models.map(model => toMerchantVerificationEntity(model));
}
