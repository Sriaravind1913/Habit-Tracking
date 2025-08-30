num=int(input("enter a number :"))
fact =1
for  i in range(1,num+1):
    fact=fact*i
    print("factorial of",num,"is ",fact)

def hi():
    a,b=int(input("value1:")),int(input("value2:"))
    return a*b
def hema ():
    c=int(input("c="))
    d=int(input("d="))
    return c+d
def main():
    sri=hi()
    shree =hema()
    print("hi",sri)
print("hey",shree)     
main()