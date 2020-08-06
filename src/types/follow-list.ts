import EditorialCommunityId from './editorial-community-id';

export default class FollowList {
  private items: Array<EditorialCommunityId>;

  constructor(items: Array<EditorialCommunityId>) {
    this.items = items;
  }

  follows(editorialCommunityId: EditorialCommunityId): boolean {
    return this.items.some((item) => item.value === editorialCommunityId.value);
  }

  unfollow(editorialCommunityId: EditorialCommunityId): void {
    this.items = this.items.filter((item) => item.value !== editorialCommunityId.value);
  }
}
