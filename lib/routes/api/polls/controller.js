
import _ from 'lodash';
import shortid from 'shortid';
import {Types} from 'mongoose';
import {Poll} from 'lib/models';

export const find = (req, res, next) => {

  Poll.find({ isPublic: true }, (err, polls) => {
    req.polls = polls;
    next();
  });

};

export const findOne = (req, res, next) => {
  let tknId = req.params.tokenOrId;

  let query = { token: tknId };
  if (Types.ObjectId.isValid(tknId)){
    query = { _id: tknId };
  }

  Poll.findOne(query, (err, poll) => {
    if (!poll) return res.status(404).end();

    if (query._id && !poll.isPublic){
      return res.status(404).end();
    }

    req.poll = poll;
    next();
  });

};

export const genToken = (req, res, next) => {

  req.poll.token = shortid.generate();
  req.poll.save((err, poll) => {
    next();
  });

};

export const create = (req, res, next) => {
  let _poll = req.body;

  delete _poll._id;
  delete _poll.token;
  delete _poll.owner;
  delete _poll.created_at;
  delete _poll.updated_at;

  Poll.create(_poll, (err, poll) => {
    req.poll = poll;
    next();
  });

};

export const update = (req, res, next) => {
  let _poll = req.body;

  delete _poll.__v;
  delete _poll._id;
  delete _poll.token;
  delete _poll.owner;
  delete _poll.created_at;

  _poll.updated_at = Date.now();

  _.assign(req.poll, _poll);
  
  req.poll.save((err, poll) => {
    req.poll = poll;
    next();
  });

};

export const sendList = (req, res) => {
  res.send(req.polls);
};

export const sendOne = (req, res) => {
  res.send(req.poll);
};