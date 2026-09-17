import { Schema, Document, Model } from 'mongoose';
export const generateSlug = <T extends Document>(schema: Schema<T>) => {
  schema.pre("validate", async function (next: any) {
    const doc = this as T & { name?: string; slug?: string };

    if (doc.isModified("name") && doc.name) {
      let baseSlug = doc.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

      let slug = baseSlug;
      let count = 1;

      // check same slug
      const Model = doc.constructor as Model<T>;
      while (await Model.exists({ slug, _id: { $ne: doc._id } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }

      doc.slug = slug;
    }
  });
};