def triangle():
	print 'Please select two of the following:'
	print '1. Number of people in your bunch'
	print '2. Amount of money contributed by each person per month'
	print '3. Total payout at the end of each month'
	P = None
	M = None
	T = None
# P = number of people in bunch
# M = amount of money payed by each person in bunch
# T = total payout

	choice = raw_input('Please enter your first choice: ')
	if choice == '1':
		P = raw_input("Please enter the number of people in your bunch: ")
	elif choice == '2':
		M = raw_input("Please enter the amount of money each person will contribute per month: ")
	elif choice == '3':
		T = raw_input("Please enter the total payout you would like to recieve at the end of each month: ")
	else:
		print "-------------------------"
		print "Please select 1, 2, or 3."
		print "-------------------------"


	choice2 = raw_input('Please select your second choice: ')
	if choice2 == choice:
		choice2 = raw_input('Please select a different number: ')
		while choice2 == choice:
			choice2 = raw_input('Please select a different number: ')
			if choice2 == '1':
				P = raw_input("Please enter the number of people in your bunch: ")
			elif choice2 == '2':
				M = raw_input("Please enter the amount of money each person will contribute per month: ")
			elif choice2 == '3':
				T = raw_input("Please enter the total payout you would like to recieve at the end of each month: ")
			else:
				print "-------------------------"
				print "Please select 1, 2, or 3."
				print "-------------------------"
	elif choice2 == '1':
		P = raw_input("Please enter the number of people in your bunch: ")
	elif choice2 == '2':
		M = raw_input("Please enter the amount of money each person will contribute per month: ")
	elif choice2 == '3':
		T = raw_input("Please enter the total payout you would like to recieve at the end of each month: ")
	else:
		print "-------------------------"
		print "Please select 1, 2, or 3."
		print "-------------------------"
		triangle()

	if not P is None: P = float(P)
	if not M is None: M = float(M)
	if not T is None: T = float(T)
	return [choice, choice2, P, M, T]


[choice, choice2, P, M, T] = triangle()
# print "choice1:", choice
# print "choice2:", choice2
# print "P:", P
# print "M:", M
# print "T:", T

def formula():
	if choice == '1' and choice2 == '2':
		print 'Total payout is $', P * M 
	elif choice == '1' and choice2 == '3':
		print 'Money payed by each person in Bunch is $', T / P
	elif choice == '2' and choice2 == '3':
		print 'The number of people that you need in your Bunch is: ', T / M 
	elif choice2 == '1' and choice == '2':
		print 'Total payout is $', P * M 
	elif choice2 == '1' and choice == '3':
		print 'Money payed by each person in Bunch is $', T / P
	elif choice2 == '2' and choice == '3':
		print 'The number of people that you need in your Bunch is: ', T / M 
		formula()

formula()
