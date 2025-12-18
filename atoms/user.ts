import { atom } from "jotai";

export interface UserData {
  email: string | null;
  companyName?: string;
  marketingConsent: boolean;
}

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
}

// User/Lead state
export const userEmailAtom = atom<string | null>(null);
export const userCompanyAtom = atom<string | null>(null);
export const hasSubmittedEmailAtom = atom<boolean>(false);
export const marketingConsentAtom = atom<boolean>(false);

// UTM tracking
export const utmParamsAtom = atom<UTMParams>({});

// Derived atoms
export const canShareAtom = atom((get) => {
  return get(hasSubmittedEmailAtom);
});

export const userDataAtom = atom((get) => ({
  email: get(userEmailAtom),
  companyName: get(userCompanyAtom),
  marketingConsent: get(marketingConsentAtom),
}));

// Actions
export const setUserEmailAtom = atom(
  null,
  (get, set, email: string) => {
    set(userEmailAtom, email);
    set(hasSubmittedEmailAtom, true);
  }
);

export const resetUserAtom = atom(null, (get, set) => {
  set(userEmailAtom, null);
  set(userCompanyAtom, null);
  set(hasSubmittedEmailAtom, false);
  set(marketingConsentAtom, false);
});
