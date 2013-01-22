require 'sinatra'
require 'haml'
require 'data_mapper'
require './checkin'
require 'digest/md5'
require 'base64'

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

  def checkin_user (name, msg, dataURI)
    checkin = Checkin.new
    checkin.name = name
    checkin.checkin_msg = msg
    checkin.checkin_at = Time.now
    checkin.save

    md5 = Digest::MD5.hexdigest(dataURI)
    filename = "#{md5}.png"
    binary = Base64.decode64(dataURI.split(',')[1])
    File.open(filename, 'wb') do |file|
      file.write binary
    end
    return checkin # not require, but easy to read
  end

  def checkout (id, msg)
    checkin = Checkin.get(id)
    checkin.checkout_at = Time.now
    checkin.checkout_msg = msg
    checkin.save
    checkin
  end
end
