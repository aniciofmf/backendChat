const Group = require("../../models/Group");
const GroupMember = require("../../models/GroupMember");
const { castStringToObjectId } = require("../../utils/db");
const { LIMIT_GROUP_LIST } = require("../../config/constants");
const asyncHandler = require("../../middleware/asyncHandler");

exports.createGroup = asyncHandler(async (req, res, next) => {
    let { name, type } = req.body;
    const { uid } = req.decoded;

    if (!type) {
      type = "public";
    }

    const groupRecord = new Group({
      groupName: name,
      groupType: type,
      userCreator: castStringToObjectId(uid)
    });

    await groupRecord.save();

    const groupMember = new GroupMember({
      group: groupRecord._id,
      member: castStringToObjectId(uid),
      owner: true,
      state: "accepted"
    });

    await groupMember.save();

    res.status(200).send(groupRecord);
  
});

exports.listGroups = asyncHandler(async (req, res, next) => {
    const { uid } = req.decoded;

    const groupLists = await GroupMember.find({
      member: castStringToObjectId(uid),
      enabled: true
    })
      .select({ owner: 1, member: 1, state: 1 })
      .populate({
        path: "group",
        select: "membersTotal groupType groupName userCreator"
      })
      .limit(LIMIT_GROUP_LIST)
      .sort({ state: 1 });

    res.send(groupLists);
  
});

exports.joinGroup = asyncHandler(async (req, res, next) => {
    const { type, groupId } = req.body;
    const { uid } = req.decoded;

    if (Group.isValidType(type)) {
      const groupToJoin = await Group.findOne({
        _id: castStringToObjectId(groupId),
        enabled: true,
        userCreator: { $ne: castStringToObjectId(uid) }
      });

      if (groupToJoin === null) {
        // El dueño trata de unirse a su propio grupo
        return res.status(400).send();
      }

      const existsAsMember = await GroupMember.findOne({
        group: castStringToObjectId(groupId),
        member: castStringToObjectId(uid),
        enabled: true
      });

      if (existsAsMember !== null) {
        // El usuario ya existe como miembro del grupo, no puede unirse de nuevo
        return res.status(400).send();
      }

      const groupMember = new GroupMember({
        group: groupToJoin._id,
        member: castStringToObjectId(uid),
        owner: false
      });

      switch (type) {
        case "public":
          if (groupToJoin.groupType === "public") {
            groupToJoin.membersTotal = groupToJoin.membersTotal + 1;
            groupMember.state = "accepted";

            await groupMember.save();
            await groupToJoin.save();

            return res.status(200).send();
          }

          return res.status(400).send();

        case "private":
          if (groupToJoin.groupType === "private") {
            groupMember.state = "pending";

            await groupMember.save();

            return res.status(200).send();
          }

          return res.status(400).send();
        default:
          return res.status(400).send();
      }
    } else {
      return res.status(400).send();
    }
});

exports.acceptMember = asyncHandler(async (req, res, next) => {
    const { groupId, memberId } = req.body;
    const { uid } = req.decoded;

    const isGroupOwner = await Group.findOne({
      _id: castStringToObjectId(groupId),
      enabled: true,
      userCreator: castStringToObjectId(uid)
    });

    if (isGroupOwner) {
      const groupMemberAccepted = await GroupMember.findOneAndUpdate(
        {
          group: castStringToObjectId(groupId),
          member: castStringToObjectId(memberId),
          state: "pending",
          owner: false,
          enabled: true
        },
        {
          state: "accepted"
        },
        {
          new: true
        }
      );

      if (groupMemberAccepted) {
        isGroupOwner.membersTotal = isGroupOwner.membersTotal + 1;
        await isGroupOwner.save();

        return res.status(200).send();
      }

      return res.status(400).send();
    } else {
      return res.status(400).send();
    }
});

exports.addMember = asyncHandler(async (req, res, next) => {
  
});
