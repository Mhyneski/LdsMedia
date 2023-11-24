import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
}

const SearchResult = ({isSearchFetching, searchedPosts}: SearchResultProps) => {
  if(isSearchFetching) return <Loader />

  if (searchedPosts && searchedPosts.documents.length > 0){
    return(
      <GridPostList posts={searchedPosts.documents} />
    )
  } 


  return (
    <div className="text-light-4 mt-10 text-center w-full">no results found</div>
  )
} 

export default SearchResult