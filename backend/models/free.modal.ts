import mongoose, { Document, Model, Schema } from "mongoose";

interface Icomment extends Document {
  user: object;
  comment: string;
  commentReplies?: Icomment[];
}

interface Ilink extends Document {
  title: string;
  url: string;
}
interface Imustdo extends Document {
  unit: string;
}
interface Imidsem extends Document {
  unit: string;
}
interface Iaakash extends Document {
  unit: string;
}
interface Isyllabus extends Document {
  unit: string;
}
interface IcourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  link: Ilink[];
  must_do: Imustdo[];
  midsem: Imidsem[];
  aakash: Iaakash[];
  syllabus: Isyllabus[];
}

interface ICourse extends Document {
  name: string;
  description?: string;
  thumbnail: object;
  tags: string;
  courseData: IcourseData[];
}

const linkSchema = new Schema<Ilink>({
  title: String,
  url: String,
});
const mustdoSchema = new Schema<Imustdo>({
  unit: String,
});
const midSChema = new Schema<Imidsem>({
  unit: String,
});
const aakashSchema = new Schema<Iaakash>({
  unit: String,
});
const syllabusSchema = new Schema<Isyllabus>({
  unit: String,
});
const courseDataSchema = new Schema<IcourseData>({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  link: [linkSchema],
  must_do: [mustdoSchema],
  midsem: [midSChema],
  aakash: [aakashSchema],
  syllabus: [syllabusSchema],
});

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  thumbnail: {
    public_id: {
      // required: true,
      type: String,
    },
    url: {
      type: String,
    },
  },
  tags: {
    type: String,
    required: true,
  },
  courseData: [courseDataSchema],
});

const FreeModal: Model<ICourse> = mongoose.model("free", courseSchema);

export default FreeModal;
