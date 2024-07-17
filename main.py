def collect_family_data():
    family_data = []

    parent_ids = input("Enter parent IDs separated by commas: ")
    parent_ids = [int(pid.strip()) for pid in parent_ids.split(',')] if parent_ids else []
    generation = int(input("Enter generation: "))
    id = input("Enter ID ")
    person_id = int(id)
    while True:
        
        name = input("Enter name (or type 'done' to finish): ")
        if name.lower() == 'done':
            break
        
        birth_date = '?'
        spouse_id = 'a'
        
        person = {
            "id": person_id,
            "name": name,
            "birthDate": birth_date,
            "spouseId": spouse_id,
            "parentIds": parent_ids,
            "generation": generation
        }

        family_data.append(person)
        person_id += 1

    return family_data


def main():
    family_data = collect_family_data()
    for person in family_data:
        print("{id: %d, name: '%s', birthDate: '%s', spouseId: null, parentIds: %s, generation: %d}," % (person["id"], person["name"], person["birthDate"], person["parentIds"], person["generation"]))


if __name__ == "__main__":
    main()
