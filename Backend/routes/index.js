const express = require('express');
const router = express.Router();
const _ = require('lodash');
const error = require('../error_handling').error;

const numberValid = (number) => /^[a-z]{3}[0-9]{3}$/i.test(number) ? number : null;
const persistence = require('../persistence');

const getOrTrhow = (object) => (prop) => (error) => {
  if (!object.hasOwnProperty(prop))
  {
    throw error(message, 400);
  }
  return object[prop];
};

const validateOwnerVehicle = (ownerVehicle) => {
  if (!ownerVehicle)
  {
    throw error('Owner must be provided', 400);
  }
  const getProp = getOrTrhow(ownerVehicle);
  return {
    number: validateNumber(ownerVehicle.number).toLowerCase(),
    owner: getProp('owner')('Owner must be provided'),
    model: getProp('model')('Model must be provided'),
    make: getProp('make')('Make must be provided')
  }
};

function validateNumber(number)
{
  if (!number)
  {
    throw new error('Number must be provided', 400);
  }
  if (numberValid(number))
  {
    return number.toLowerCase();
  }else {
    throw error('Number invalid. It should be 6 characters length - start with three letters and end with three numbers.', 400);
  }
}

async function verifyExists(number, res)
{
  if (!await persistence.numberExists(number))
  {
    res.status(404).end();
    return;
  }
  return number;
}

router.param('number', function (req, res, next) {
  validateNumber(req.params.number);
  next();
});

router.get('/api/vehicleOwners', async function (req, res, next) {
  res.send(await persistence.getOwners());
});

router.get('/api/models', async function(req, res, next) {
  res.send(await persistence.getModelsWithMakes());
});

router.get('/api/vehicles/exists/:number', async function (req, res, next) {
  res.send(await persistence.numberExists(req.params.number));
});

router.post('/api/vehicles/add', async function (req, res, next) {
  await persistence.addOwner(validateOwnerVehicle(req.body));
  res.send();
});

router.delete('/api/vehicles/:number', async function (req, res, next) {
  if (!await persistence.deleteOwner(await verifyExists(req.params.number)))
  {
    throw new error('Vehicle owner was not deleted');
  }
  res.send();
});

router.put('/api/vehicles', async function (req, res, next) {
  const vehicleOwner = validateOwnerVehicle(req.body);
  verifyExists(vehicleOwner.number);
  if (await persistence.updateOwner(vehicleOwner))
  {
    return res.send(vehicleOwner);
  }
  throw error('Vehicle owner was not deleted');
});

module.exports = router;
