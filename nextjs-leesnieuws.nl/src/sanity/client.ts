import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "6idcxy5u",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});