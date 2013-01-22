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

  return checkin # not required, but easy to read
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
    "/default/default.png"
  end
end
