DataMapper::setup(:default, "sqlite3://#{Dir.pwd}/hackerspace.db")

class Checkin
  include DataMapper::Resource

  property :id, Serial
  property :name, Text, required: true
  property :checkin_at, DateTime
  property :checkout_at, DateTime
  property :checkin_msg, Text, default: ""
  property :checkout_msg, Text, default: ""

end

DataMapper.finalize.auto_upgrade!
