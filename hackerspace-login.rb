require 'sinatra'
require 'haml'
require 'data_mapper'
require 'base64'

require './helpers'
require './checkin'

class HackerspaceLogin < Sinatra::Base

  get '/' do
    checkins = Checkin.all(order: [:checkin_at.desc], conditions: ['checkout_at IS NULL'], limit: 20) || []
    checkouts = Checkin.all(order: [:checkin_at.desc], conditions: ['checkout_at IS NOT NULL'], limit: 20) || []
    haml :index, locals: {checkins: checkins, checkouts: checkouts}
  end

  post '/checkin' do
    name  = params[:name] || ""
    msg = params[:checkin_msg] || ""
    dataURI = params[:dataURI] || ""

    checkin = checkin_user name.strip, msg.strip, dataURI
    haml :checkin, locals: {checkin: checkin}
  end

  post '/checkout' do
    checkout = checkout(params[:id], params[:checkout_msg])
    haml :checkout, locals: {checkout: checkout}
  end

  get '/megaman/:id.gif' do
    content_type 'image/gif'
    File.read('public/default/default.png')
  end


end
