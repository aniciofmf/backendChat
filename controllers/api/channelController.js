const uuidv4 = require("uuid/v4");
const { getChatClientUser } = require("../../modules/streamchat/chatClient");

exports.createChannel = async (req, res, next) => {
  try {
    const { channelName, channelType } = req.body;
    const { id, username, image } = req.decoded;

    const chatClient = await getChatClientUser({ id, name: username, avatar: image },req.chatToken);

    const channelNameId = `${channelName}-${uuidv4()}`;

    const newChannel = chatClient.channel("messaging", channelNameId, {
      chanType: channelType,
      chanName: channelName,
      created_by_id: id
    });

    const newChannelCreation = await newChannel.create();

    res.status(200).json([
      {
        id: channelNameId,
        name: channelName,
        created_by: username,
        type: newChannelCreation.channel.chanType,
        unread: 0,
        lastMessage: {}
      }
    ]);
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = req.chatClient.channel("messaging", channelId);
    await channel.watch();

    console.log(channel);

    res.sendStatus(200);
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.listChannels = async (req, res, next) => {
  try {
    const chanListResponse = [];

    const filter = { chanType: { $eq: "public" } };
    //const filter = { "created_by_id": 'testuser' };

    const channels = await req.chatClient.queryChannels(
      filter,
      { last_message_at: -1, created_at: -1 },
      { watch: true, state: true }
    );

    channels.map(channel => {
      let lastMsg;

      if (channel.state.messages[channel.state.messages.length - 1]) {
        lastMsg = {
          id: channel.state.messages[channel.state.messages.length - 1].id,
          text: channel.state.messages[channel.state.messages.length - 1].text,
          created_at:
            channel.state.messages[channel.state.messages.length - 1]
              .created_at,
          user: channel.state.messages[channel.state.messages.length - 1].user
        };
      }

      //console.log(channel.state.read);

      chanListResponse.push({
        id: channel.data.id,
        cid: "messaging:" + channel.data.id,
        name: channel.data.chanName,
        type: channel.data.chanType,
        created_by: channel.data.created_by.name,
        unread: channel.countUnread(),
        lastMessage: lastMsg
      });
    });

    res.status(200).send(chanListResponse);
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.deleteChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = req.chatClient.channel("messaging", channelId);

    await channel.delete();

    res.status(200).json({ message: "deleted" });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.deleteAllChannels = async (req, res, next) => {
  try {
    const { id } = req.decoded;

    const filter = {
      created_by_id: id
    };

    const channels = await req.chatClient.queryChannels(filter, {}, {});

    const channelsToDelete = channels.map(channel => {
      return channel.id;
    });

    channelsToDelete.forEach(async channel => {
      const channelD = req.chatClient.channel("messaging", channel);

      await channelD.delete();
    });

    res.status(200).json({ message: "deleted" });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = req.chatClient.channel("messaging", channelId);
    await channel.watch();

    res.status(200).send(channel.state.messages);
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { channelId, userId } = req.body;

    const channel = req.chatClient.channel("messaging", channelId);
    await channel.addMembers([userId]);

    res.status(200).send({ member: "added" });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};
