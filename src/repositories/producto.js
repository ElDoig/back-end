import model from '../models/producto.js'
import RepositoryBase from './RepositoryBase.js'

const repository = new RepositoryBase(model);

export default repository;