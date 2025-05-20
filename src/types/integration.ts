
import { Json } from "@/types/supabase";

// Define the complete interface for integration logs coming from the database
export interface IntegrationLogEntity {
  id: string;
  merchant_id?: string;
  integration_id?: string;
  service_type?: string;
  service_name?: string;
  integration_type: string;
  event_type: string;
  status: string;
  created_at: string;
  updated_at?: string;
  response_time?: number;
  duration_ms?: number;
  success?: boolean;
  error_message?: string;
  external_reference?: string;
  request_data?: Json;
  response_data?: Json;
}

// Frontend-friendly model for integration logs
export interface IntegrationLogModel {
  id: string;
  merchantId?: string;
  integrationId?: string;
  serviceType?: string;
  serviceName?: string;
  integrationType: string;
  eventType: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  responseTime?: number;
  durationMs?: number;
  success?: boolean;
  errorMessage?: string;
  externalReference?: string;
  requestData?: any;
  responseData?: any;
}

// Converter functions
export const toIntegrationLogModel = (entity: IntegrationLogEntity): IntegrationLogModel => {
  return {
    id: entity.id,
    merchantId: entity.merchant_id,
    integrationId: entity.integration_id,
    serviceType: entity.service_type,
    serviceName: entity.service_name,
    integrationType: entity.integration_type,
    eventType: entity.event_type,
    status: entity.status,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    responseTime: entity.response_time,
    durationMs: entity.duration_ms,
    success: entity.success,
    errorMessage: entity.error_message,
    externalReference: entity.external_reference,
    requestData: entity.request_data,
    responseData: entity.response_data
  };
};

export const toIntegrationLogEntity = (model: IntegrationLogModel): IntegrationLogEntity => {
  return {
    id: model.id,
    merchant_id: model.merchantId,
    integration_id: model.integrationId,
    service_type: model.serviceType,
    service_name: model.serviceName,
    integration_type: model.integrationType,
    event_type: model.eventType,
    status: model.status,
    created_at: model.createdAt,
    updated_at: model.updatedAt,
    response_time: model.responseTime,
    duration_ms: model.durationMs,
    success: model.success,
    error_message: model.errorMessage,
    external_reference: model.externalReference,
    request_data: model.requestData as Json,
    response_data: model.responseData as Json
  };
};
