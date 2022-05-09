package other;

public class Person {
    private int id;
    private String name;
    private MobilePhone phone;

    public Person(int id, String name) {
        setId(id);
        setName(name);
    }

    private void setId(int id) {
        if (id < 1) {
            throw new Error("Invalid id.");
        }
    }

    private static void validateName(String name) {
        if (name == null) {
            throw new Error("Name must not be null.");
        }
        if (name.length() > 30) {
            throw new Error("Name too long.");
        }
        for (int i = 1; i < name.length() - 1; i++) {
            if (name.charAt(i) == ' ') {
                return;
            }
        }
        throw new Error("Invalid name format.");
    }


    public void setName(String name) {
        validateName(name);
        this.name = name;
    }

    public void setPhone(MobilePhone phone) {
        this.phone = phone;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public MobilePhone getPhone() {
        return phone;
    }

    @Override
    public String toString() {
        return "other.Person{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", phone=" + phone +
                '}';
    }
}
