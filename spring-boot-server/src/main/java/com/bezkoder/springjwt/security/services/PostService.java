package com.bezkoder.springjwt.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import com.bezkoder.springjwt.models.Post;
import com.bezkoder.springjwt.repository.PostRepository;

@Service
public class PostService {
	
	@Autowired
	PostRepository postRepo;
	
	public void addPost(Post p) {
		postRepo.save(p);
	}

	public Optional<Post> getPostById(Long id) {
		return postRepo.findById(id);
	}

}
