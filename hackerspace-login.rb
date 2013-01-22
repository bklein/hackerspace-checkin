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

    filename = "#{checkin.id}.png"
    unless dataURI.empty?
      filepath = "public/photos/#{filename}"
      binary = Base64.decode64(dataURI.split(',')[1])
      File.open(filepath, 'wb') do |file|
        file.write binary
      end

      checkin.photo_name = filename
      checkin.save
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

  def url_for_photo photo
    if !photo.nil? && !photo.empty?
      "/photos/#{photo}"
    else
      "/photos/default.png"
    end
  end
end
