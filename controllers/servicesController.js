const jsonwebtoken = require("jsonwebtoken");
const SaloonOwner = require("../models/saloonowner");
const Service = require("../models/services");
const { JWT_KEY } = require("../keys");

const createService = async (req, res) => {
  const token = req.cookies.token;
  const { serviceTitle, serviceDesc, serviceCost } = req.body;
  if (token) {
    try {
      const tokenData = jsonwebtoken.verify(token, JWT_KEY);
      const saloonOwnercheck = await Service.findOne({
        shopOwner: tokenData.id,
      });
      if (!saloonOwnercheck) {
        Service.create({
          shopOwner: tokenData.id,
          servicesOffered: {
            serviceTitle: serviceTitle,
            serviceDesc: serviceDesc,
            serviceCost: serviceCost,
          },
        });
        return res.json({ msg: "service added successfully" });
      } else {
        saloonOwnercheck.servicesOffered.push({
          serviceTitle: serviceTitle,
          serviceDesc: serviceDesc,
          serviceCost: serviceCost,
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
      return res.json({ msg: "Service deleted successfully" });
    } catch (error) {
      return res.json({ msg: error.message });
    }
  } else {
    return res.json({ msg: "Unauthorized User" });
  }
};

module.exports = { createService, deleteservice, editservice };
