import { consumerModel } from "../models/consumerModel.js";

const consumerProfiles = new Map([
  [
    "owner-uuid-101",
    {
      id: "owner-uuid-101",
      name: "Iverene Grace M. Causapin",
      email: "iverene.causapin@sucolwater.local",
      purok: "Purok 4",
      status: "Active",
    },
  ],
]);

function serviceError(code, message) {
  return Object.assign(new Error(message), { code });
}

export const consumerService = {
  async getProfile(profileId) {
    if (!profileId) {
      throw serviceError("UNAUTHORIZED", "An authenticated consumer is required.");
    }

    const profile = consumerProfiles.get(profileId);

    if (!profile) {
      throw serviceError("PROFILE_NOT_FOUND", "Profile record could not be found.");
    }

    const [readings, invoices] = await Promise.all([
      consumerModel.findReadings(profileId, profileId),
      consumerModel.findInvoices(profileId, profileId),
    ]);

    return {
      ...profile,
      readings,
      invoices,
    };
  },
};
