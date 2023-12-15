import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return null; // You need to return something even if there's an error
  }

  if (!creators) {
    // Handle the case where creators is null or undefined
    return <p>Invalid data structure for users.</p>;
  }

  if (!('documents' in creators)) {
    // Handle the case where creators.documents does not exist
    return <p>Invalid data structure for users.</p>;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators.documents.map((creator: any) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;