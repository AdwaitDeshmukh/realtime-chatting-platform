import Message from "../models/Message.js"
import User from "../models/User.js"
export const getAllContacts = async (req, res) => {
    try {
        // Defensive check: if protectRouter failed, return early
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllContacts:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessagesByUserId = async (req, res) => {
    try{
    const myId=req.user._id;
    const {id}=req.params;

    const message=await Message.find({
        $or:[
            {senderId:myId,receiverId:id},
            {senderId:id,receiverId:myId}
        ]
    });
    res.status(200).json(message);
    }
    catch(error){
        console.log("Error in getMessagesByUserId:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const {id}=req.params;

        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - No user session found" });
        }

        const myId=req.user._id;
        
        if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (myId.equals(id)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: id });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

   const newMessage = new Message({
  senderId: myId,    // Must match schema key 'senderId'
  receiverId: id,   // Must match schema key 'receiverId'
  text,
  image: imageUrl,
});

    await newMessage.save();
    res.status(201).json(newMessage);
    }
    catch (error) {
    console.error("DEBUG - sendMessage Error:", error); // This prints the full error stack
    res.status(500).json({ message: "Internal Server Error", error: error.message });
}
};

export const getAllCharPartners=async(req,res)=>{
    try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }

}