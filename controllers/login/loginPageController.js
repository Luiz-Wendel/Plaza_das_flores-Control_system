const express = require('express')
const app = express() 
const {Usuario} = require('../../models')
const session = require('express-session')
const bcrypt = require('bcrypt')
const cookie = require('cookie-parser')


const  loginPageController = {
  login: (req,res) => {
    req.session.user = undefined
    res.render("login/login", {titulo:"Acesso"})
  },
  
  auth: async (req,res) => {
    const {email,senha} = req.body
    const remember_me = req.body['remember-me']

    const usuario = await Usuario.findOne({
      where: {email}
    })

    if (usuario == undefined) {
      let erro = 'Usuário não encontrado, por favor contate o síndico'
      return res.render("login/login", {titulo:"Acesso",erro})
    }

    if (usuario.status == false) {
      let erro = 'Usuário desativado, por favor contate o síndico'
      return res.render("login/login", {titulo:"Acesso",erro})
    }

    if (!bcrypt.compareSync(senha,usuario.senha)){
      let erro = "Senha incorreta, tente novamente ou use a opção 'esqueci minha senha'"
      return res.render("login/login", {titulo:"Acesso",erro})
    }
    usuario.senha = ''

    if(remember_me == 'true' ){
      res.cookie('user', usuario.token , {maxAge:2*10**9})
    }
    
    req.session.user = usuario
    
    switch (usuario.tipo_usuario_id) {

      case 1:
        res.redirect("/backoffice/morador/perfil")
        break;
      case 2:
        res.redirect("/backoffice/sindico/moradores")
        break;
      case 3:
        res.redirect("/backoffice/portaria/moradores")
        break;
  
      default:
        res.redirect('/login')
        break;
    }

    
  
}

}
module.exports = loginPageController