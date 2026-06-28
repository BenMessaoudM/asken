import { Schema, model, models } from 'mongoose';

const localizedTextSchema = new Schema({ sv: { type: String, default: '' }, en: { type: String, default: '' } }, { _id: false });
const socialLinksSchema = new Schema({ instagram: String, linkedin: String, facebook: String, tiktok: String, other: String }, { _id: false });

const collaborationSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  type: { type: String, required: true, enum: ['arcada_association', 'student_nation', 'sponsor', 'company', 'university', 'strategic_partner', 'student_organization', 'other'] },
  description: { type: localizedTextSchema, required: true },
  shortDescription: localizedTextSchema,
  logoUrl: String,
  logoAltText: localizedTextSchema,
  websiteUrl: String,
  email: String,
  contactPerson: String,
  socialLinks: { type: socialLinksSchema, default: () => ({}) },
  officeAtCor: { type: Boolean, default: false },
  officeHours: localizedTextSchema,
  location: String,
  active: { type: Boolean, default: true },
  visible: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  tags: localizedTextSchema,
  internalNotes: String,
  relationshipOwner: String,
  validFrom: Date,
  validUntil: Date,
}, { timestamps: true });

collaborationSchema.index({ type: 1, active: 1, visible: 1, featured: -1, displayOrder: 1 });
collaborationSchema.index({ name: 'text', 'description.sv': 'text', 'description.en': 'text', 'tags.sv': 'text', 'tags.en': 'text' });

export const CollaborationModel = models.Collaboration || model('Collaboration', collaborationSchema);
