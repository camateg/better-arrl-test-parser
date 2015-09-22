require 'json'
require 'open-uri'

type = ARGV[0]

questions = []
lines = []
question_pos = []

file = File.open(type + '.txt', 'r').each_line do |line|
	lines.push line  
end

lines.each_with_index do |line,ct|
	if /\w\d\w\d+\s\(\w\)/.match line
		question_pos.push ct
	end
end

dl_figs = []

question_pos.each do |pos|
	q_tmp = lines[pos]
	q_tmp_out = /(\w\d\w\d+)\s\((\w)\)/.match q_tmp
		
	tmp = {}
	tmp['question_no'] = q_tmp_out[1]
	tmp['correct_ans'] = q_tmp_out[2] 
	tmp['question'] = lines[pos+1].chomp!

	fig = '00'

	if /figure\s\w\d+/i.match tmp['question']
		fig_rgx = /figure\s(\w\d+\-?\d?)/i.match tmp['question']
		fig = fig_rgx[1]
		dl_figs.push fig
	end

	tmp['fig'] = fig
	
	ans_tmp = lines.slice(pos+2..pos+5)
	ans_out = []
	ans_tmp.each do |ans|
		ans_cont = /(\w)\..(.*)/.match ans

		if !ans_cont.nil? && ans_cont.length > 0
			ans_tmp = Hash.new
			ans_tmp['letter'] = ans_cont[1]
			ans_tmp['answer'] = ans_cont[2]
			ans_out.push ans_tmp
		end
	end

	tmp['answers'] = ans_out

	questions.push tmp
end

dl_figs.each do |fig|
	begin
		open('./public/' + fig + '.jpg', 'wb') do |file|
			file << open('http://ncvec.org/downloads/' + fig + '.jpg').read
		end
	rescue
		'File not found for ' + fig
	end
end


puts questions.to_json
