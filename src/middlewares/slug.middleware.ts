import { Schema, Document, Model } from 'mongoose';

export const generateSlug = <T extends Document>(schema: Schema<T>) => {
  schema.pre("save", function (next: any) {
    const doc = this as T & { name?: string; slug?: string };

    if (doc.isModified("name") && doc.name) {
      doc.slug = doc.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
    }

    next();
  });
};