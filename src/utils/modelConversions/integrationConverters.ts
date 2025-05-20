
import { IntegrationLogEntity, IntegrationLogModel } from '@/types/integration';

export const toIntegrationLogModel = (entity: IntegrationLogEntity): IntegrationLogModel => {
  return {
    id: entity.id,
    serviceType: entity.service_type || '',
    endpoint: entity.endpoint || '',
    requestData: entity.request_data || {},
    responseData: entity.response_data || {},
    status: entity.status || '',
    merchantId: entity.merchant_id,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at || entity.created_at,
    statusCode: entity.status_code,
    errorMessage: entity.error_message || '',
    duration: entity.duration,
    eventType: entity.event_type || '',
    integrationType: entity.integration_type || ''
  };
};

export const toIntegrationLogModels = (entities: IntegrationLogEntity[]): IntegrationLogModel[] => {
  return entities.map(toIntegrationLogModel);
};
