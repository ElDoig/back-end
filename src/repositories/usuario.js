import model from '../models/usuario.js'
import RepositoryBase from './RepositoryBase.js'

const repository = new RepositoryBase(model);

repository.findByName = async function (username) {
    try {
        return await model.findOne({
            where: { usuario: username}
        })
    } catch(err){
        console.log('error en findByName')
        console.log(err)
        return null
    }
}

export default repository;