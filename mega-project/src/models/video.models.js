import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema(
    {
      videoFile:{
        type:String,
        required:true
      },
      thumbnail:{
        type:String,
        required:true
      },
      title:{
        type:String,
        required:true
      },
      description:{
        type:String,
        required:true
      },
      duration:{
        type:Number,
        required:true
      },
      isPublished:{
        type:Boolean,
        default:true
      },
      owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
      },
      views:{
        type:[String],
        default:[]
      },
      tags:{
        type:[String],
        default:[]
      },
      likes:{
        type:[String],
        default:[]
      },
      dislikes:{
        type:[String],
        default:[]
      }
    },{timestamps:true}
    )

videoSchema.plugin(mongooseAggregatePaginate)

    export const Video=mongoose.model("Video",videoSchema)