require('json')

json = JSON.load(File.read("iota.json"))

base_uri = ENV["BASE_URI"].nil? ? "http://localhost:3031" : ENV["BASE_URI"]

sleep(5)
puts "Available paths:"
json.each do |line| 
  puts base_uri + line["path"] unless line["path"].nil? 
end;nil
