const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();
const SaloonOwner = require("../models/saloonowner");
const Service = require("../models/services");
const JWT_KEY = process.env.JWT_KEY;

const createService = async (req, res) => {
  const token = req.cookies.token;
  const { serviceTitle, serviceDesc, serviceCost, serviceImage } = req.body;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const saloonOwnercheck = await Service.findOne({
        shopOwner: tokenData.id,
      });
      if (!saloonOwnercheck) {
        const newService = await Service.create({
          shopOwner: tokenData.id,
          servicesOffered: {
            serviceTitle: serviceTitle,
            serviceDesc: serviceDesc,
            serviceCost: serviceCost,
            serviceImage: serviceImage,
          },
        });
        await SaloonOwner.findByIdAndUpdate(tokenData.id, {
          $push: { services: newService._id },
        });
        return res.json({ msg: "service added successfully" });
      } else {
        saloonOwnercheck.servicesOffered.push({
          serviceTitle: serviceTitle,
          serviceDesc: serviceDesc,
          serviceCost: serviceCost,
          serviceImage: serviceImage,
        });

        await saloonOwnercheck.save();
        return res.json({ msg: "service added successfully" });
      }
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized User" });
  }
};

const editservice = async (req, res) => {
  const id = req.params.id;
  const token = req.cookies.token;
  const { serviceTitle, serviceDesc, serviceCost } = req.body;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const editingService = await Service.findOne({
        shopOwner: tokenData.id,
      });
      const edit_service = editingService.servicesOffered.find(
        (el) => el._id.toString() === id.toString()
      );
      edit_service.serviceTitle = serviceTitle;
      edit_service.serviceDesc = serviceDesc;
      edit_service.serviceCost = serviceCost;
      await editingService.save();
      return res.json({ msg: "edited successfully" });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized User" });
  }
};

const deleteservice = async (req, res) => {
  const id = req.params.id;
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const delService = await Service.findOne({
        shopOwner: tokenData.id,
      });
      const filteredServices = delService.servicesOffered.filter(
        (el) => el._id.toString() != id.toString()
      );
      delService.servicesOffered = filteredServices;
      delService.save();
      if (delService.servicesOffered.length === 0) {
        await SaloonOwner.findByIdAndUpdate(tokenData.id, {
          $pull: { services: delService._id },
        });
      }
      return res.json({ msg: "Service deleted successfully" });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized User" });
  }
};

const fetchservices = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const saloonServices = await Service.findOne({
        shopOwner: tokenData.id,
      });

      return res.json({ saloonServices });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized user" });
  }
};

module.exports = { createService, deleteservice, editservice, fetchservices };
