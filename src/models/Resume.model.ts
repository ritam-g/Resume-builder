import { IResume } from "@/types/resume.type";
import mongoose from "mongoose";

let resumeSchema = new mongoose.Schema<IResume>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        default: "My Resume"
    },
    summery: {
        type: String,
        required: true,
        default: "My Resume summery"
    },
    personalInfo: {
        type: {
            fullname: String,
            email: String,
            mobile: Number,
            country: String,
            pincode: Number,
            location: String
        },
        default: {}
    },
    workExperience: {
        type: [
            {
                company: {
                    type: String,
                    required: true
                },
                position: {
                    type: String,
                    required: true
                },
                startDate: {
                    type: String,
                    required: true
                },
                endDate: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                }
            }
        ],
        default: []
    },
    projects: {
        type: [
            {
                project: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                githubLink: {
                    type: String,
                    required: true
                },
                liveLink: {
                    type: String,
                    required: true
                },
                techStack: {
                    type: [String],
                    required: true
                }
            }
        ],
        default: []
    },
    education: {
        type: [
            {
                institute: {
                    type: String,
                    required: true
                },
                degree: {
                    type: String,
                    required: true
                },
                startDate: {
                    type: String,
                    required: true
                },
                endDate: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    required: true
                }
            }
        ],
        default: []
    },
    skills: {
        type: [String],
        required: true
    },
    certifications: {
        type: [String],
        default: []
    },
    acheivements: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})


const resumeModel = mongoose.models.Resume || mongoose.model<IResume>("Resume", resumeSchema)
export default resumeModel