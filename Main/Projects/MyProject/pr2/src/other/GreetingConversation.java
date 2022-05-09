package other;

public class GreetingConversation {

    private static class GreetingConversationInstance {
        private static final GreetingConversation instance = new GreetingConversation();
    }

    private GreetingConversation() {}

    public static GreetingConversation getInstance() {
        return GreetingConversationInstance.instance;
    }

    public void main() {
        MobilePhone phone = new MobilePhone("M-SAM-123", Color.BLUE, 2022, true);

        Person person = new Person(1, "Quan Dang");
        person.setPhone(phone);

        System.out.println(person);
    }
}
