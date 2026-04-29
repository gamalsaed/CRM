import { LEAD_FIELDS } from "../constance";
import { LeadSchema } from "../types/lead-types";
import Lead from "../../Models/lead-modal";
import { Query as MongooseQuery } from "mongoose";

type Query = {
  fields?: string;
  page?: string;
  limit?: string;
} & Partial<LeadSchema>;

const fields = [...LEAD_FIELDS, "createdAt"];

class LeadAPIFeature {
  queryObject: Query;
  LeadModal: typeof Lead;
  query: MongooseQuery<any, any>;
  constructor(queryObject: Query, LeadModal: typeof Lead) {
    this.queryObject = queryObject;
    this.LeadModal = LeadModal;
    this.query = LeadModal.find();
  }
  filter() {
    const filters: Partial<LeadSchema> = {};

    for (let key in this.queryObject) {
      if (fields.includes(key)) {
        filters[key as keyof LeadSchema] = this.queryObject[
          key as keyof Query
        ] as any;
      }
    }
    
    this.query = this.LeadModal.find(filters);
    return this;
  }

  fields() {
    if (this.queryObject["fields"]) {
      let selectedFields = this.queryObject["fields"].split(",").join(" ");
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    const page = Number(this.queryObject.page) || 1;
    const limit = Number(this.queryObject.limit) || 5;

    const skip = page * limit - limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}
export default LeadAPIFeature;
