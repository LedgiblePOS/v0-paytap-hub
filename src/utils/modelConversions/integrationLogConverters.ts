
import { IntegrationLogEntity, IntegrationLogModel } from '@/types/integration';

export const toIntegrationLogModel = (entity: IntegrationLogEntity): IntegrationLogModel => {
  return {
    id: entity.id,
    integrationId: entity.integration_id || '',
    merchantId: entity.merchant_id || '',
    eventType: entity.event_type || '',
    serviceType: entity.service_type || entity.event_type || '',
    status: entity.status,
    requestData: entity.request_data,
    responseData: entity.response_data,
    errorMessage: entity.error_message || '',
    externalReference: entity.external_reference || '',
    duration: entity.duration_ms || 0,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at || entity.created_at,
    durationMs: entity.duration_ms || 0,
    integrationType: entity.integration_type || '',
    serviceName: entity.service_name || null,
    responseTime: entity.response_time || null,
    success: entity.success !== undefined ? entity.success : null
  };
};

export const toIntegrationLogEntity = (model: IntegrationLogModel): IntegrationLogEntity => {
  return {
    id: model.id,
    integration_id: model.integrationId || null,
    merchant_id: model.merchantId || null,
    event_type: model.eventType,
    service_type: model.serviceType || null,
    status: model.status,
    request_data: model.requestData,
    response_data: model.responseData,
    error_message: model.errorMessage || null,
    external_reference: model.externalReference || null,
    duration_ms: model.duration || model.durationMs || null,
    created_at: model.createdAt,
    updated_at: model.updatedAt || model.createdAt,
    integration_type: model.integrationType || null,
    service_name: model.serviceName || null,
    response_time: model.responseTime || null,
    success: model.success
  };
};

export const toIntegrationLogModels = (entities: IntegrationLogEntity[]): IntegrationLogModel[] => {
  return entities.map(toIntegrationLogModel);
};
