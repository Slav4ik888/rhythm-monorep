import { PARTNER_IDS } from '../../consts';

export const isValidPartnerId = (partnerCode: string | null): boolean => PARTNER_IDS.includes(partnerCode || '');
