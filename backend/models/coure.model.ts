import mongoose, { Document, Model, Schema } from "mongoose";

interface Icomment extends Document {
  user: object;
  comment: string;
  commentReplies?: Icomment[];
}

interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
  commentReplies: Icomment[];
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
  suggestions: string;
  question: Icomment[];
}

interface ICourse extends Document {
  name: string;
  description?: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  demoUrl: string;
  reviews: IReview[];
  courseData: IcourseData[];
  ratings?: number;
  purchased?: number;
}

const reviwSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
});

const linkSchema = new Schema<Ilink>({
  title: String,
  url: String,
});

const commentSchema = new Schema<Icomment>({
  user: Object,
  comment: String,
  commentReplies: [Object],
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
  suggestions: String,
  question: [commentSchema],
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
  price: {
    type: Number,
    required: true,
  },
  estimatedPrice: {
    type: Number,
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
  demoUrl: {
    type: String,
    // required: true,
  },
  reviews: [reviwSchema],
  courseData: [courseDataSchema],
  ratings: {
    type: Number,
    default: 0,
  },
  purchased: {
    type: Number,
    default: 0,
  },
});

const CourseModal: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModal;
