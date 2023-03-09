'use strict';

//管理员列表
const MANAGER_LIST = 'manager_list';

const ISSUER_PRE = 'issuer';
const TEMPLATE_PRE = 'template';
const REVOKE_PRE = 'revoke_';

const PROPOSAL_PRE = 'proposal_';
const PROPOSAL_NUM = 'proposal_num';
const BASE_PROPOSAL_NUM = '10000000';

const DDO_CONTRACT_INDEX = 7;

const PROPOSAL_TYPE = {
    ISSUER: '1',
    TEMPLATE: '2'
};

const STATUS = {
    APPLYING: '1',
    PASSED: '2',
    REJECTED: '3',
    REVOKED: '4'
  };


const CREDENTIAL_STATUS = {
    NORMAL: '0',
    REVOKED: '1'
  };


const g_issuerDocument = {
	'@context': ['https://www.w3.org/ns/did/v1'],
	'version': '1.0.0',
	'id': '',
	'publicKey': [{
		'id': '',
		'type': 'Ed25519',
		'controller': '',
		'publicKeyHex': ''
	}],
	'authentication': [''],
	'extension': {
		'recovery': [''],
		'attributes': [{
			'key': 'companyName',
			'encrypt': 0,
			'format': 'text',
			'desc': 'company name',
			'value': ''
		}],
		'ttl': 86400,
		'type': 102
	},
	'created': '',
	'updated': ''
};


function makeProposalKey(num){
    return PROPOSAL_PRE + num;
}

function makeKey(first, second, third = ''){
    return (third === '') ? (first + '_' + second) : (first + '_' + second + '_' + third);
}

function loadObj(key){
    let data = Chain.load(key);
    if(data !== false){
        return JSON.parse(data);
    }else{
        return null;
    }
    
}

function saveObj(key, value){
    Chain.store(key, JSON.stringify(value));
}


function savePorposalNum(num){
    saveObj(PROPOSAL_NUM, num);
}

function createNextPorposalNum(){
    let currentNum =  loadObj(PROPOSAL_NUM);
    let nextNum =  Utils.int64Add(currentNum, 1);
    savePorposalNum(nextNum);
    return nextNum;
}



function savePorposal(num,info){
    saveObj(makeProposalKey(num), info);
}

function getPorposal(proposalNum){
    return loadObj(makeProposalKey(proposalNum));
}

function deletePorposal(proposalNum){
    return Chain.del(makeProposalKey(proposalNum));
}

function saveInfo(symbol,id,info){
    saveObj(makeKey(symbol, id), info);
}

function getInfo(symbol,id){
    return loadObj(makeKey(symbol, id));
}

function checkExisted(key, arrayList) {
    let i = 0;
    for(i=0; i < arrayList.length; i+=1){
      if(arrayList[i] === key){ return true; }
    }
    return false;
}

function assertParamExist(param,paramStr) {
    Utils.assert(param !== undefined, paramStr + ' is null!');
}

function assertArrayParamExist(paramList,paramStr) {
    Utils.assert(paramList !== undefined && paramList.length > 0, paramStr + ' is null!');
}


//判断是否为管理员节点
function verifyManager(){
    let managerList = loadObj(MANAGER_LIST);
    Utils.assert(managerList !== null, 'managers init is null');
    Utils.assert(checkExisted(Chain.msg.sender, managerList), 'Not manager accounts');
}

function assertIssuerApplyParams(params) {
    assertParamExist(params.endpoint,'endpoint');
    assertParamExist(params.companyName,'companyName');
    assertParamExist(params.publicKey,'publicKey');
}

function issuerApply(params){
    assertIssuerApplyParams(params);
    let bid = Chain.msg.sender;
    let proposal_num = createNextPorposalNum();
    let issuerObj = {
        'proposalType':PROPOSAL_TYPE.ISSUER,
        'proposalNum':proposal_num,
        'bid': bid,
        'website': params.website,
        'endpoint': params.endpoint,
        'desc': params.desc,
        'companyName': params.companyName,
        'publicKey': params.publicKey,
        'status': STATUS.APPLYING,
        'createTime':Chain.block.timestamp,
        'blockHeight':Chain.block.number
    };
    savePorposal(proposal_num,makeKey(ISSUER_PRE, bid));
    saveInfo(ISSUER_PRE,issuerObj.bid,issuerObj);
    Chain.tlog('issuerApply',proposal_num,bid,params.endpoint,params.companyName);
    return;
}


function assertTemplateApplyParams(params) {
    assertParamExist(params.templateId,'templateId');
    assertParamExist(params.templateName,'templateName');
    assertParamExist(params.industryId,'industryId');
    assertParamExist(params.certType,'certType');
    assertParamExist(params.userType,'userType');
    assertParamExist(params.version,'version');
    assertParamExist(params.vcFormat,'vcFormat');
    assertParamExist(params.applyFormat,'applyFormat');
}

function templateApply(params){
    assertTemplateApplyParams(params);
    //发证方提交申请
    let issuerBid = Chain.msg.sender;
    let issuerObj = getInfo(ISSUER_PRE,issuerBid);
    Utils.assert(issuerObj !== null, 'you are not issuer!');
    Utils.assert(issuerObj.status === STATUS.PASSED, 'issuer is not approved!');
    let templateId = params.templateId;
    let proposal_num = createNextPorposalNum();
    let templateObj = {
        'proposalType':PROPOSAL_TYPE.TEMPLATE,
        'proposalNum':proposal_num,
        'issuerBid': issuerBid,
        'templateId': templateId,
        'templateName': params.templateName,
        'industryId': params.industryId,
        'certType': params.certType,
        'userType': params.userType,
        'version': params.version,
        'remark': params.remark,
        'status': STATUS.APPLYING,
        'vcFormat': params.vcFormat,
        'applyFormat': params.applyFormat,
        'createTime':Chain.block.timestamp,
        'blockHeight':Chain.block.number
    };
    savePorposal(proposal_num,makeKey(TEMPLATE_PRE, templateId));
    saveInfo(TEMPLATE_PRE,templateObj.templateId,templateObj);
    Chain.tlog('templateApply', proposal_num,issuerBid,templateId,params.templateName);
    return;
}

function assertRevokeParams(params) {
    assertParamExist(params.credentialId,'credentialId');
}

function revoke(params){
    assertRevokeParams(params);
    let issuerBid = Chain.msg.sender;
    let issuerObj = getInfo(ISSUER_PRE,issuerBid);
    Utils.assert(issuerObj !== null, 'you are not issuer!');

    let credentialId = params.credentialId;
    let revokeObj = {
        'issuerBid': issuerBid,
        'credentialId': credentialId,
        'reason': params.reason,
        'createTime':Chain.block.timestamp,
        'blockHeight':Chain.block.number
    };
    let revokeId = issuerBid + '_' + credentialId;
    saveInfo(REVOKE_PRE,revokeId,revokeObj);
    Chain.tlog('revoke', issuerBid,credentialId,params.reason);
    return;
}


function assertApproveParams(params) {
    assertParamExist(params.applyNo,'applyNo');
    assertParamExist(params.status,'status');
}

function buildIssuerDocument(bid,publicKey,companyName){
    let issuerDocument =   g_issuerDocument;
    issuerDocument.id = bid;
    let publicKeyId = bid + '#key-1';
    issuerDocument.publicKey[0].id = publicKeyId;
    issuerDocument.publicKey[0].controller = bid;
    issuerDocument.publicKey[0].publicKeyHex = publicKey;
    issuerDocument.authentication[0] = publicKeyId;
    issuerDocument.extension.recovery[0] = publicKeyId;
    issuerDocument.extension.attributes[0].value = companyName;
    issuerDocument.created = Chain.block.timestamp;
    issuerDocument.updated = Chain.block.timestamp;
    return issuerDocument;
}

function isExistDdoDocument(bid) {
    let inputObj = {};
    inputObj.method = 'queryBid';
    inputObj.params = {};
    inputObj.params.id = bid;

    let resultObj = Chain.contractQuery(Chain.getSystemContracts()[DDO_CONTRACT_INDEX], JSON.stringify(inputObj));
    //
    if(resultObj.error === undefined){
        return true;
    }
    return false;

}


function createIssuerDdoDocument(bid,publicKey,companyName) {
    if(isExistDdoDocument(bid)){
        return;
    }
    //不存在bid文档，则创建bid文档
    let issuerDocument =  buildIssuerDocument(bid,publicKey,companyName);
    let inputObj = {};
    inputObj.method = 'creation';
    inputObj.params = {};
    inputObj.params.document = issuerDocument;
    Chain.contractCall(Chain.getSystemContracts()[DDO_CONTRACT_INDEX], true,'0',JSON.stringify(inputObj));
    //Chain.tlog('createIssuerDdoDocument', resultObj, JSON.stringify(issuerDocument));

}


function approveIssuer(params){
    assertApproveParams(params);
    //管理员
    verifyManager();
    
    let auditBid = Chain.msg.sender;
    let applyNo = params.applyNo;
    let issuerProKey = getPorposal(applyNo);
    Utils.assert(issuerProKey !== null, 'applyNo does not exist or have ever approved !');
    let issuerProObj = loadObj(issuerProKey);
    Utils.assert(issuerProObj.proposalType === PROPOSAL_TYPE.ISSUER, 'proposal num is not issuer proposal!');
    let issuerObj = issuerProObj;
    issuerObj.auditBid = auditBid;
    if(params.status === '1'){
        createIssuerDdoDocument(issuerObj.bid,issuerObj.publicKey,issuerObj.companyName);
        delete issuerObj.proposalType;
        issuerObj.status = STATUS.PASSED;
        saveInfo(ISSUER_PRE,issuerObj.bid,issuerObj);
    }else if(params.status === '0'){
        issuerObj.status = STATUS.REJECTED;
        saveInfo(ISSUER_PRE,issuerObj.bid,issuerObj);
    }else{
        throw 'params.status is invalid !';
    }
    deletePorposal(applyNo);
    Chain.tlog('approveIssuer', applyNo,params.status);
    return;
}




function approveTemplate(params){
    assertApproveParams(params);
    //管理员
    verifyManager();
    
    let auditBid = Chain.msg.sender;
    let applyNo = params.applyNo;
    let templateProKey = getPorposal(applyNo);
    Utils.assert(templateProKey !== null, 'applyNo does not exist or have ever approved !');
    let templateProObj = loadObj(templateProKey);
    Utils.assert(templateProObj.proposalType === PROPOSAL_TYPE.TEMPLATE, 'proposal num is not template proposal!');
    let templateObj = templateProObj;
    templateObj.auditBid = auditBid;
    if(params.status === '1'){
        delete templateObj.proposalType;
        templateObj.status = STATUS.PASSED;
        saveInfo(TEMPLATE_PRE,templateObj.templateId,templateObj);
    }else if(params.status === '0'){
        templateObj.status = STATUS.REJECTED;
        saveInfo(TEMPLATE_PRE,templateObj.templateId,templateObj);
    }else{
        throw 'params.status is invalid !';
    }
    deletePorposal(applyNo);
    Chain.tlog('approveTemplate', applyNo,params.status);
    return;
}



function revokeIssuer(params){
    let issuerBid = params.issuerBid;
    assertParamExist(issuerBid,'issuerBid');
    //管理员
    verifyManager();
    
    let issuerObj = getInfo(ISSUER_PRE,issuerBid);
    Utils.assert(issuerObj !== null, ' issuer does not exist!');

    issuerObj.status = STATUS.REVOKED;
    issuerObj.auditBid = Chain.msg.sender;
    issuerObj.reason = params.reason;
    saveInfo(ISSUER_PRE,issuerBid,issuerObj);

    Chain.tlog('revokeIssuer', issuerBid,params.reason);
    return;
}


function revokeTemplate(params){
    let templateBid = params.templateBid;
    assertParamExist(templateBid,'templateBid');
    //管理员
    verifyManager();
    
    let templateObj = getInfo(TEMPLATE_PRE,templateBid);
    Utils.assert(templateObj !== null, ' template does not exist!');

    templateObj.status = STATUS.REVOKED;
    templateObj.auditBid = Chain.msg.sender;
    templateObj.reason = params.reason;
    saveInfo(TEMPLATE_PRE,templateBid,templateObj);

    Chain.tlog('revokeTemplate', templateBid,params.reason);
    return;
}


function updateManagers(params){
    let managersList = params.managersList;
    assertArrayParamExist(managersList,'managersList');
    //管理员
    verifyManager();
    
    saveObj(MANAGER_LIST, managersList);

    Chain.tlog('updateManagers', JSON.stringify(managersList));
    return;
}




function queryCredentialRevokeStatus(params){
    let id = makeKey(params.issuerBid , params.credentialId);
    let revokeObj =  getInfo(REVOKE_PRE,id);
    let retStatus = {
        'status':CREDENTIAL_STATUS.NORMAL
    };
    if(revokeObj !== null){
        retStatus.status = CREDENTIAL_STATUS.REVOKED;
    }
    return retStatus;

}

function queryTemplate(params){
    return getInfo(TEMPLATE_PRE,params.bid);
}

function queryIssuer(params){
    return getInfo(ISSUER_PRE,params.bid);
}


function query(input_str){
  let funcList = {
    'queryIssuer' : queryIssuer,
    'queryTemplate' : queryTemplate,
    'queryCredentialRevokeStatus' : queryCredentialRevokeStatus
  };
  let inputObj = JSON.parse(input_str);
  Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
  return JSON.stringify(funcList[inputObj.method](inputObj.params));
}

function init(input_str)
{
  let params = JSON.parse(input_str).params;
  Utils.assert(params.managersList !== undefined && params.managersList.length > 0, 'Param obj has no managersList.');
  savePorposalNum(BASE_PROPOSAL_NUM);
  saveObj(MANAGER_LIST, params.managersList);
  return;
}


function main(input_str){
    let funcList = {
      'issuerApply' : issuerApply,
      'templateApply' : templateApply,
      'revoke' : revoke,
      'approveIssuer' : approveIssuer,
      'approveTemplate' : approveTemplate,
      'revokeIssuer' : revokeIssuer,
      'revokeTemplate' : revokeTemplate,
      'updateManagers' : updateManagers
    };
    let inputObj = JSON.parse(input_str);
    Utils.assert(funcList.hasOwnProperty(inputObj.method) && typeof funcList[inputObj.method] === 'function', 'Cannot find func:' + inputObj.method);
    funcList[inputObj.method](inputObj.params);
  }
  