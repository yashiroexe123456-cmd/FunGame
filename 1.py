brands=['dell','ausu','mac','lenovo','acer']

for brand in brands:
    if brand=='ausu':
        print(brand.upper())
    else:
        print(brand.title())

for brand in brands:
    if brand=='mac':
        print("iOS")

atttendances=[75,85]
for att in atttendances:
    if att>=85:
        print("Good job! You can do the assignment")
    else:
        print("sorry, you lose the chance")