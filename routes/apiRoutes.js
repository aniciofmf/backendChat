const checkJwtToken = require('../middleware/jwtVerify');
const checkChatToken = require('../modules/streamchat/middleware/chatToken');

const loginController = require('../controllers/api/loginController');
const registerController = require('../controllers/api/registerController');
const channelController = require('../controllers/api/channelController');
const groupController = require('../controllers/api/groupController');

const messageController = require('../controllers/api/messageController');
const userChatController = require('../controllers/api/userChatController');

module.exports = (router) => {
    // Login, Register 
    router.post('/login',loginController.login);
    router.post('/register',registerController.register);
    router.post('/logout',[checkJwtToken,checkChatToken],loginController.logout);

    // Groups & Group Members
    router.get('/group/list',[checkJwtToken,checkChatToken],groupController.listGroups);
    router.post('/group/create',[checkJwtToken,checkChatToken],groupController.createGroup);
    router.post('/group/join',[checkJwtToken,checkChatToken],groupController.joinGroup);
    router.post('/group/acceptMember',[checkJwtToken,checkChatToken],groupController.acceptMember);
    router.post('/group/addMember',[checkJwtToken,checkChatToken],groupController.addMember);

    // Channel
    router.get('/channel/list',[checkJwtToken,checkChatToken],channelController.listChannels);
    router.get('/channel/info/:channelId',[checkJwtToken,checkChatToken],channelController.getChannel);
    router.get('/channel/messages/:channelId',[checkJwtToken,checkChatToken],channelController.getMessages);

    router.post('/channel/create',[checkJwtToken,checkChatToken],channelController.createChannel);
    router.post('/channel/addMember',[checkJwtToken,checkChatToken],channelController.addMember);

    router.delete('/channel/delete/:channelId',[checkJwtToken,checkChatToken],channelController.deleteChannel);
    router.delete('/channel/deleteAll',[checkJwtToken,checkChatToken],channelController.deleteAllChannels);

    // Message
    router.post('/message/create',[checkJwtToken,checkChatToken],messageController.createMessage);

    // User Chat
    router.post('/userchat/updateRole',[checkJwtToken,checkChatToken],userChatController.updateRole);
    router.post('/userchat/state',[checkJwtToken,checkChatToken],userChatController.userState);

};
